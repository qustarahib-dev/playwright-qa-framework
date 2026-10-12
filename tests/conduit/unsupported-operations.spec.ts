import { test, expect } from '@playwright/test';

test.use({ baseURL: 'http://localhost:4000' });

test.describe.serial('Conduit article unsupported operations', () => {
  const username = `unsupported_${Date.now()}`;
  const email = `${username}@example.com`;
  const password = 'Passw0rd!';
  let token = '';
  let slug = '';

  test.beforeAll(async ({ request }) => {
    const reg = await request.post('/api/users', {
      data: { user: { username, email, password } },
    });
    token = (await reg.json()).user.token;

    const art = await request.post('/api/articles', {
      headers: { Authorization: `Token ${token}` },
      data: {
        article: {
          title: `Unsupported Ops Test ${Date.now()}`,
          description: 'd',
          body: 'b',
          tagList: [],
        },
      },
    });
    slug = (await art.json()).article.slug;
  });

  test('editing an article is not supported (PUT returns 404)', async ({ request }) => {
    const res = await request.put(`/api/articles/${slug}`, {
      headers: { Authorization: `Token ${token}` },
      data: { article: { title: 'Updated' } },
    });
    expect(res.status()).toBe(404);
  });

  test('deleting an article is not supported (DELETE returns 404)', async ({ request }) => {
    const res = await request.delete(`/api/articles/${slug}`, {
      headers: { Authorization: `Token ${token}` },
    });
    expect(res.status()).toBe(404);
  });

  test('the article still exists and is unchanged after the failed attempts', async ({ request }) => {
    const res = await request.get(`/api/articles/${slug}`, {
      headers: { Authorization: `Token ${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.article.title).toContain('Unsupported Ops Test');
  });
});
