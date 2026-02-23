import { type Page, type Locator, expect } from '@playwright/test';

export class HomePage {
  private readonly topXTab: Locator;
  private readonly insightsHeader: Locator;
  private readonly chartBars: Locator;
  private readonly tooltip: Locator;

  constructor(private readonly page: Page) {
    this.topXTab = page.getByText('TopX');
    this.insightsHeader = page.getByText(/Insights from/i);
    this.chartBars = page.locator('svg text').filter({ hasText: /\$/ });
    this.tooltip = page.locator('.echart-tooltips.v2');
  }

  async goto(): Promise<void> {
    await this.page.goto('/#/home');
  }

  async waitForReady(): Promise<void> {
    await this.page.waitForFunction(() => {
      const spinner = document.querySelector('#nprogress');
      return !spinner || getComputedStyle(spinner).opacity === '0';
    });
    await expect(this.insightsHeader).toBeVisible();
  }

  async clickTopXTab(): Promise<void> {
    await this.topXTab.click();
  }

  async getChartBarCount(): Promise<number> {
    await this.page.waitForLoadState('networkidle');
    return this.chartBars.count();
  }

  async hoverChartBar(index = 0): Promise<void> {
    await this.chartBars.nth(index).hover({ force: true });
  }

  async getTooltipText(): Promise<string> {
    await expect(this.tooltip.first()).toBeVisible();
    return (await this.tooltip.first().textContent()) ?? '';
  }
}
