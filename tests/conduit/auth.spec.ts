import { test, expect } from '@playwright/test';
import { Client } from 'pg';

test.use({ baseURL: 'http://localhost:4000' });

const dbConfig = {
  host: 'localhost',
  port: Number(process.env.DB_PORT ?? 35432),
  user: 'admin',
  password: 'secret',
  database: 'realworld-backend-app',
};

test.describe.serial('Conduit authentication', () => {
  const username = `auth_${Date.now()}`;
  const email = `${username}@example.com`;
  const password = 'Passw0rd!';
  let token = '';

  test.afterAll(async () => {
    const db = new Client(dbConfig);
    await db.connect();
    await db.query('DELETE FROM users WHERE username = $1', [username]);
    await db.end();
  });

  test('registers a user and returns a token', async ({ request }) => {
    const res = await request.post('/api/users', {
      data: { user: { username, email, password } },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.user.token).toBeTruthy();
  });

  test('logs in with valid credentials', async ({ request }) => {
    const res = await request.post('/api/users/login', {
      data: { user: { email, password } },
    });
    expect(res.status()).toBe(200);
    token = (await res.json()).user.token;
    expect(token).toBeTruthy();
  });

  test('rejects a wrong password', async ({ request }) => {
    const res = await request.post('/api/users/login', {
      data: { user: { email, password: 'wrong-password' } },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
    expect(await res.text()).toContain('Incorrect email address or password');
  });

  test('rejects a request with no token', async ({ request }) => {
    const res = await request.get('/api/user');
    expect(res.status()).toBe(401);
  });

  test('returns the current user for a valid token', async ({ request }) => {
    const res = await request.get('/api/user', {
      headers: { Authorization: `Token ${token}` },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).user).toMatchObject({ username, email });
  });

  test('rejects registering a duplicate email', async ({ request }) => {
    const res = await request.post('/api/users', {
      data: { user: { username: `${username}_2`, email, password } },
    });
    expect(res.ok()).toBeFalsy();
  });
});