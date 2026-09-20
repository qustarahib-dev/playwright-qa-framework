import { Page } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  async addItem(testId: string) {
    await this.page.locator(`[data-test="add-to-cart-${testId}"]`).click();
  }

  get cartBadge() {
    return this.page.locator('[data-test="shopping-cart-badge"]');
  }
}
