import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

test.use({ baseURL: 'https://www.saucedemo.com' });

test('adding items updates the cart badge', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);

  await login.goto();
  await login.login('standard_user', 'secret_sauce');

  await inventory.addItem('sauce-labs-backpack');
  await expect(inventory.cartBadge).toHaveText('1');

  await inventory.addItem('sauce-labs-bike-light');
  await expect(inventory.cartBadge).toHaveText('2');
});
