import { test, expect, devices } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.use({
  ...devices['Pixel 7'],
  baseURL: 'https://www.saucedemo.com',
});

test('user can log in on a mobile viewport', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory/);
  await expect(page.locator('[data-test="title"]')).toHaveText('Products');
});
