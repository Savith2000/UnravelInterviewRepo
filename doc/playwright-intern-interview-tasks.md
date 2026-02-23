# Playwright Intern Interview – Take-Home Tasks

This document describes 5 practical tasks to assess your Playwright skills. Complete as many as you can in the time available. We care about clear, maintainable code and correct behavior more than finishing every task.

**For candidates:** Login is already configured. When you run tests, a global setup logs in once (admin / unraveldata) and stores the session in `playwright/.auth/user.json`. Every test starts **already logged in** — you can focus on writing tests; no need to log in inside your specs.

**Setup:** Use a new or existing Playwright project. You can use any target site (e.g. [Playwright demo](https://demo.playwright.dev/), [the-internet](https://the-internet.herokuapp.com/), or one we provide). If we give you a URL and credentials, use those.

**What to submit:** Your code (spec files and any page objects) plus a short note on what you did and what you would do with more time.

---

## Task 1 – Navigation and title check 

**Goal:** Write a test that opens a page and checks its title or main heading.

**Instructions:**
1. Navigate to a given URL (we will provide one, or use `https://playground-databricks.unraveldata.com/`).
2. Assert that the page title (or the main heading on the page) contains expected text.

**Acceptance criteria:**
- One test that uses `page.goto()` (or equivalent).
- At least one assertion on the page title or a visible heading.
- Test runs and passes.

---

## Task 2 – Filter, search, or date range (page-level) 

**Goal:** Use a filter, search box, or date range on the page (not inside a modal) and assert that the content updates. (Forms in modals are covered in Task 4.)

**Instructions:**
1. Navigate to a page that has a filter, search input, date range picker, or similar control on the main page.
2. Change the value (e.g. select a filter, type in search, pick a date range) and apply it (e.g. click "Apply", press Enter, or wait for auto-apply).
3. Assert that the page content updates as expected (e.g. filtered list, updated chart, result count, or URL/query change).

**Acceptance criteria:**
- The control is located in a stable way (e.g. `getByRole`, `getByLabel`, or placeholder).
- The action is performed and the UI is updated (or loading completes).
- At least one assertion checks the outcome (visible content, count, or URL).

---

## Task 3 – Table: headers, row count, and link click 

**Goal:** Work with a data table: check headers, row count, and click a link in a row.

**Instructions:**
1. Navigate to a page that displays a table with multiple columns and rows.
2. Assert that the table has the expected column headers (e.g. "Name", "Status", "Actions" – adjust to the page you use).
3. Assert that the table has at least one data row (or a specific number of rows if the page is fixed).
4. Click a link or button in the first row (e.g. "View", "Details", or similar).
5. Assert that the click had the right effect (e.g. navigation to a new URL or new content visible).

**Acceptance criteria:**
- Table is located and its headers are asserted.
- Row count is asserted (e.g. `>= 1` or exact count).
- An action in the first row (link/button) is clicked.
- One assertion verifies the result of that action.

---

## Task 4 – Modal: open, fill, submit, assert 

**Goal:** Complete a flow that opens a modal, fills the form inside it, submits, and checks the result. Scope all interactions to the modal and assert that the list/table on the page updates.

**Instructions:**
1. On a page that has a button to open a modal (e.g. "Add item", "New record", "Create").
2. Click the button and wait until the modal is visible.
3. Fill all required fields inside the modal.
4. Click the submit/save button in the modal.
5. Assert that a success message (e.g. toast or banner) appears.
6. Assert that the new item appears in the list or table on the page.
7. Optionally: assert that the modal is closed after submit.

**Acceptance criteria:**
- Modal is opened and waited for (e.g. visible).
- All interactions inside the modal are scoped to the modal (so you don't accidentally target elements outside).
- Submit is clicked and both the success message and the new/updated list entry are asserted.
- Code is clear and maintainable.

---

## Task 5 – Page object and conditional skip 

**Goal:** Use a page object and write two tests, one of which skips when there is no data.

**Instructions:**
1. Choose a single page/screen (e.g. a list view, dashboard, or table view).
2. Create a **page object** for that page with at least:
   - A method to navigate to the page (e.g. `gotoX()`).
   - A method to wait until the page is ready (e.g. loader gone or main content visible).
   - One action method (e.g. "open create modal", "select first item", "apply filter").
3. Write **two tests** that use this page object:
   - **Test A (happy path):** Navigate to the page, perform the action, and assert a visible outcome (e.g. modal opens, table has headers, or first row is present).
   - **Test B (no data):** Same page but in a state where there might be no data (e.g. empty list, no table rows). Use a conditional skip (e.g. `test.skip()` or an `if` that skips the test) when there is no data, and add a **short comment** in the code explaining why the test is skipped in that case.
   - **Test C (chart tooltip):** Click on a chart element (e.g. one bar or segment). Wait for the tooltip to appear, then **collect the tooltip text/content** and assert that it contains expected information (e.g. a label, value, or date). Optionally return the tooltip content from the page object and assert it in the spec.

4. Use `beforeEach` (or equivalent) for common setup (e.g. navigation or login) in the spec.

**Acceptance criteria:**
- One page object file with at least: navigation, wait-for-ready, and one action method.
- One spec file with two tests that use the page object.
- `beforeEach` (or similar) is used for shared setup.
- Test B skips when there is no data and includes a brief comment explaining the skip.

---

## General notes

- **Locators:** Prefer user-facing locators (role, label, text) over brittle CSS/XPath when possible.
- **Waits:** Use built-in waiting (e.g. `expect().toBeVisible()`) rather than fixed `setTimeout` where you can.
- **Structure:** Keep specs readable; use page objects when they make the test clearer.


Good luck.
