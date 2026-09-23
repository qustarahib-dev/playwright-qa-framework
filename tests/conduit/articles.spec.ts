import { test, expect } from '@playwright/test';

test.use({ baseURL: 'http://localhost:4000' });

test.describe.serial('Conduit articles', () => {
  const username = `articles_${Date.now()}`;
  const email = `${username}@example.com`;
  const password = 'Passw0rd!';
  const title = `Test Article ${Date.now()}`;
  let token = '';
  let slug = '';

  test.beforeAll(async ({ request }) => {
    const res = await request.post('/api/users', {
      data: { user: { username, email, password } },
    });
    token = (await res.json()).user.token;
  });

  test('creating an article requires a token', async ({ request }) => {
    const res = await request.post('/api/articles', {
      data: { article: { title: 'No Auth', description: 'x', body: 'x' } },
    });
    expect(res.status()).toBe(401);
  });

  test('creates an article with a valid token', async ({ request }) => {
    const res = await request.post('/api/articles', {
      headers: { Authorization: `Token ${token}` },
      data: { article: { title, description: 'A test', body: 'Body text', tagList: ['test'] } },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    slug = body.article.slug;
    expect(body.article).toMatchObject({ title, description: 'A test' });
  });

  test('reading a single article requires a token', async ({ request }) => {
    const res = await request.get(`/api/articles/${slug}`);
    expect(res.status()).toBe(401);
  });

  test('reads the article back with a valid token', async ({ request }) => {
    const res = await request.get(`/api/articles/${slug}`, {
      headers: { Authorization: `Token ${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.article.slug).toBe(slug);
  });

  test('listing articles requires a token', async ({ request }) => {
    const res = await request.get('/api/articles');
    expect(res.status()).toBe(401);
  });
});
