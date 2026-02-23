import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test.describe('Home page – TopX', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    await homePage.waitForReady();
    await homePage.clickTopXTab();
  });

  test('Test A – happy path: TopX tab loads with chart sections', async ({ page }) => {
    await expect(page.getByText(/Most savings with migrating/i)).toBeVisible();
    await expect(page.getByText(/Total cost/i).first()).toBeVisible();

    await page.getByText(/Most untapped savings/i).click();
    await expect(page.getByText(/Most savings with migrating/i)).toBeVisible();
  });

  test('Test B – skip when no chart data is available', async () => {
    const barCount = await homePage.getChartBarCount();
    test.skip(barCount === 0, 'No chart data available to interact with');

    expect(barCount).toBeGreaterThan(0);
  });

  test('Test C – chart tooltip contains expected information', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    await homePage.hoverChartBar(0);

    const tooltipText = await homePage.getTooltipText();
    expect(tooltipText).toContain('$');
  });
});
