import { test, expect } from '@playwright/test';

test.describe('Jobs page', () => {
  test('navigates to jobs and shows heading', async ({ page }) => {
    await page.goto('/#/jobs/jobs');
    await expect(page).toHaveURL(/\/#\/jobs\/jobs/);
    //await expect(page.getByText(/Insights|Cost rating|Summary/i).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /Jobs/i })).toBeVisible();
  });
});


