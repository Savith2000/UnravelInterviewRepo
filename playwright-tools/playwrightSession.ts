import {chromium, type Browser, type Page} from 'playwright';
import path from 'path';
import {fileURLToPath} from 'url';

const thisDir = path.dirname(fileURLToPath(import.meta.url));
const AUTH_FILE = path.resolve(thisDir, '../playwright/.auth/user.json');
const BASE_URL = 'https://playground-databricks.unraveldata.com';

export async function withPage<T>(fn: (page: Page) => Promise<T>): Promise<T> {
  let browser: Browser | null = null;
  try {
    browser = await chromium.launch({headless: true});
    const context = await browser.newContext({
      baseURL: BASE_URL,
      storageState: AUTH_FILE,
    });
    const page = await context.newPage();
    return await fn(page);
  } finally {
    if (browser) await browser.close();
  }
}
