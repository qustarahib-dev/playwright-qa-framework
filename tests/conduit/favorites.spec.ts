import { test, expect } from '@playwright/test';

test.use({ baseURL: 'http://localhost:4000' });

test.describe.serial('Conduit article favorites', () => {
  const username = `fav_${Date.now()}`;
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
          title: `Fav Test ${Date.now()}`,
          description: 'd',
          body: 'b',
          tagList: [],
        },
      },
    });
    slug = (await art.json()).article.slug;
  });

  test('new articles have favoritesCount 0 and favorited false', async ({ request }) => {
    const res = await request.get(`/api/articles/${slug}`, {
      headers: { Authorization: `Token ${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.article.favoritesCount).toBe(0);
    expect(body.article.favorited).toBe(false);
  });

  test('this backend does not expose a favorite endpoint', async ({ request }) => {
    const res = await request.post(`/api/articles/${slug}/favorite`, {
      headers: { Authorization: `Token ${token}` },
    });
    expect(res.status()).toBe(404);
  });
});
