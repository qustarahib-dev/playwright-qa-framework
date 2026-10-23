import { test, expect } from '@playwright/test';

test.use({ baseURL: 'http://localhost:4000' });

test.describe.serial('Conduit comments (unimplemented)', () => {
  const username = `comments_${Date.now()}`;
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
          title: `Comments Test ${Date.now()}`,
          description: 'd',
          body: 'b',
          tagList: [],
        },
      },
    });
    slug = (await art.json()).article.slug;
  });

  test('listing comments on an article is not supported (404)', async ({ request }) => {
    const res = await request.get(`/api/articles/${slug}/comments`, {
      headers: { Authorization: `Token ${token}` },
    });
    expect(res.status()).toBe(404);
  });

  test('posting a comment on an article is not supported (404)', async ({ request }) => {
    const res = await request.post(`/api/articles/${slug}/comments`, {
      headers: { Authorization: `Token ${token}` },
      data: { comment: { body: 'test comment' } },
    });
    expect(res.status()).toBe(404);
  });
});
