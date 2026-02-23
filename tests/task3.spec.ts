import { test, expect } from '@playwright/test';

test.describe('Clusters table', () => {
  test('verifies headers, row data, and goes into cluster details', async ({ page }) => {
    await page.goto('/#/compute/dbclusters');
    await expect(page).toHaveURL(/\/#\/compute\/dbclusters/);

    await page.locator('.component-date-picker').click();
    await page.getByText('Last 7 Days').click();

    await page.waitForFunction(() => {
      const spinner = document.querySelector('#nprogress');
      return !spinner || getComputedStyle(spinner).opacity === '0';
    });

    await expect(page.getByRole('columnheader', { name: 'Cluster Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Job Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Cluster Type' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'User' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Workspace' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Start Time' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Setup Duration' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'App Duration' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();

    const rows = page.getByRole('row');
    expect(await rows.count()).toBeGreaterThan(1);

    await rows.nth(1).getByRole('link').first().click();

    await page.waitForFunction(() => {
      const spinner = document.querySelector('#nprogress');
      return !spinner || getComputedStyle(spinner).opacity === '0';
    });
    await expect(page.locator('#nprogress')).toBeHidden();
    await expect(page.getByRole('button', { name: /Update Insights/i })).toBeVisible();

    await expect(page.getByRole('link', { name: 'Clusters' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Analysis' })).toBeVisible();
  });
});
