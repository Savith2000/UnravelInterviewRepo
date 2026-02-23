# Playwright Interview – Take-Home

**Take-home tasks:** See [doc/playwright-intern-interview-tasks.md](doc/playwright-intern-interview-tasks.md).

## Auth (already set up)

Login runs once in **global setup** and the session (cookies/token) is saved to `playwright/.auth/user.json`. All tests start **already logged in** so you can focus on writing tests.

- **URL:** https://playground-databricks.unraveldata.com/#/
- **Credentials:** `admin` / `unraveldata` (used only in `global-setup.ts`)

## Run tests

```bash
npm install
npx playwright install
```

**Recommended: Playwright UI (spec list + click to run, no auto-run)**

- Run **`npm run test:ui`** — global setup (login) runs once, then the Playwright editor opens with the **spec list**. Click a spec or test to run it; nothing runs automatically.
- Only Chromium is configured, so you get a single browser.

**Other ways to run:**

- **Headed (one Chromium window):** `npm run test:headed`
- **Headless (e.g. CI):** `npm test`
- **Single file:** `npx playwright test tests/home.spec.ts`

**If the spec list is empty in UI:** run `npm run test:ui` from the **project root** (the folder that contains `package.json` and `playwright.config.ts`). Check that tests appear with: `npx playwright test --list`
