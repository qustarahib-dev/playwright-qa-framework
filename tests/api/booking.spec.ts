import { test, expect } from '@playwright/test';

test.use({
  baseURL: 'https://restful-booker.herokuapp.com',
  extraHTTPHeaders: { Accept: 'application/json' },
});

const booking = {
  firstname: 'Qusta',
  lastname: 'Tester',
  totalprice: 150,
  depositpaid: true,
  bookingdates: { checkin: '2026-10-01', checkout: '2026-10-05' },
  additionalneeds: 'Breakfast',
};

test.describe('Restful-Booker API', () => {
  test('create, read, and delete a booking', async ({ request }) => {
    const auth = await request.post('/auth', {
      data: { username: 'admin', password: 'password123' },
    });
    expect(auth.ok()).toBeTruthy();
    const { token } = await auth.json();

    const created = await request.post('/booking', { data: booking });
    expect(created.status()).toBe(200);
    const { bookingid } = await created.json();

    const fetched = await request.get(`/booking/${bookingid}`);
    expect(fetched.ok()).toBeTruthy();
    expect(await fetched.json()).toMatchObject(booking);

    const deleted = await request.delete(`/booking/${bookingid}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(deleted.status()).toBe(201);

    const gone = await request.get(`/booking/${bookingid}`);
    expect(gone.status()).toBe(404);
  });
});
