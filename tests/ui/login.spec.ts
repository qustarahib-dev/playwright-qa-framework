import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.use({ baseURL: 'https://www.saucedemo.com' });

test.describe('SauceDemo login', () => {
  test('valid user can log in @smoke', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('locked out user sees an error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('locked_out_user', 'secret_sauce');
    await expect(login.error).toContainText('locked out');
  });
});
