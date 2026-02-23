import { test, expect } from '@playwright/test';

test.describe('Cost Explorer Budgets', () => {
  test('creates a new budget and verifies it appears', async ({ page }) => {
    await page.goto('/#/cost_explorer/budgets');
    await expect(page).toHaveURL(/\/#\/cost_explorer\/budgets/);
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('button', { name: 'New Budget' })).toBeVisible();
    await page.getByRole('button', { name: 'New Budget' }).click();
    await page.waitForLoadState('networkidle');
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(modal.getByRole('link', { name: 'Save' })).toBeVisible();
    const randomName = `budget-${Math.random().toString(36).slice(2, 8)}`;
    await modal.getByLabel('Name').fill(randomName);
    await modal.getByLabel('Description').fill('this is a test');
    await modal.locator('input[aria-required="true"]').fill('30.31');
    await modal.getByRole('link', { name: 'Save' }).click();
    await expect(modal).toBeHidden();
    await expect(page.getByText('You have added a new budget successfully.')).toBeVisible();
    await expect(page.getByText(randomName)).toBeVisible();
  });
});
