import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { LoginPage } from './pages/login.page';

const AUTH_FILE = path.join(__dirname, 'playwright', '.auth', 'user.json');
const BASE_URL = 'https://playground-databricks.unraveldata.com/#/';
const CREDENTIALS = { username: 'admin', password: 'unraveldata' };

async function globalSetup() {
  const dir = path.dirname(AUTH_FILE);
  fs.mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL: BASE_URL });
  const page = await context.newPage();

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(CREDENTIALS.username, CREDENTIALS.password);
  await loginPage.waitForAppReady();

  await context.storageState({ path: AUTH_FILE });
  await browser.close();
}

export default globalSetup;
