import { test, expect } from '@playwright/test';

test.describe('Jobs Insights', () => {
  test('changes date range to Last 7 days', async ({ page }) => {
    await page.goto('/#/jobs/insights');
    await expect(page).toHaveURL(/\/#\/jobs\/insights/);
    await page.waitForLoadState('networkidle');
    await page.locator('.daterange-selector .multiselect__select').click();
    await page.getByText('Last 7 days').click();
    await page.waitForLoadState('networkidle');
    await page.locator('.job-insights.unravel-loading').waitFor({ state: 'hidden' });

    await expect(page.locator('.daterange-selector')).toContainText('Last 7 days');
  });
});
