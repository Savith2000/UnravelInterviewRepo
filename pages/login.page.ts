import { type Page } from '@playwright/test';

const BASE_URL = 'https://playground-databricks.unraveldata.com/#/';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(BASE_URL);
  }

  /**
   * Log in with the given credentials.
   * Form uses <h2> for labels (no <label>), so we target inputs by name attribute.
   */
  async login(username: string, password: string): Promise<void> {
    await this.page.locator('input[name="username"]').fill(username);
    await this.page.locator('input[name="password"]').fill(password);
    await this.page.getByRole('button', { name: /sign in/i }).click();
  }

  /** Wait until the app has finished loading (e.g. after redirect from login). */
  async waitForAppReady(): Promise<void> {
    // Wait for URL to change from login or for main content to appear
    await this.page.waitForURL(/unraveldata\.com/, { waitUntil: 'networkidle' }).catch(() => {});
    await this.page.waitForLoadState('networkidle');
  }
}
