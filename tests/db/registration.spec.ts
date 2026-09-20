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

test.describe('User registration (API + database)', () => {
  const username = `qa_${Date.now()}`;
  const email = `${username}@example.com`;
  const password = 'Passw0rd!';
  let db: Client;

  test.beforeAll(async () => {
    db = new Client(dbConfig);
    await db.connect();
  });

  test.afterAll(async () => {
    await db.query('DELETE FROM users WHERE username = $1', [username]);
    await db.end();
  });

  test('registering a user creates a row with a hashed password', async ({ request }) => {
    const res = await request.post('/api/users', {
      data: { user: { username, email, password } },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.user).toMatchObject({ username, email });
    expect(body.user.token).toBeTruthy();

    const { rows } = await db.query(
      'SELECT email, password_hash FROM users WHERE username = $1',
      [username]
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].email).toBe(email);
    expect(rows[0].password_hash).not.toBe(password);
    expect(rows[0].password_hash.length).toBeGreaterThan(40);
  });
});