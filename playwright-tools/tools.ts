import {withPage} from './playwrightSession.ts';

const VALID_PERIODS = ['Last 7 days', 'Last 14 days', 'Last 30 days', 'Last 90 days'] as const;

export async function getDailyCostTrend(
  period: string = 'Last 30 days',
): Promise<{status: string; period: string; trend: {date: string; cost: number}[]}> {
  const matched = VALID_PERIODS.find((p) => p.toLowerCase() === period.toLowerCase()) ?? 'Last 30 days';

  return withPage(async (page) => {
    await page.goto('/#/cost_explorer/trends');

    await page.waitForFunction(() => {
      const spinner = document.querySelector('#nprogress');
      return !spinner || getComputedStyle(spinner).opacity === '0';
    });

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.locator('.daterange-selector .multiselect__select').click();
    await page.waitForTimeout(500);
    await page.getByText(matched).click();
    await page.waitForFunction(() => {
      const spinner = document.querySelector('#nprogress');
      return !spinner || getComputedStyle(spinner).opacity === '0';
    });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const pageSizeCombo = page.getByRole('combobox').first();
    await pageSizeCombo.selectOption('100');
    await page.waitForTimeout(1000);

    const totalCostLink = page.getByRole('link', {name: 'Total cost'});
    await totalCostLink.click();
    await page.waitForTimeout(500);
    await totalCostLink.click();
    await page.waitForTimeout(500);

    const rows = await page.evaluate(() => {
      const table = document.querySelector('table.unravel-table');
      if (!table) return [];

      const trs = table.querySelectorAll('tbody tr');
      const result: {date: string; cost: number}[] = [];

      trs.forEach((tr) => {
        const cells = tr.querySelectorAll('td');
        if (cells.length >= 2) {
          const dateText = cells[0]?.textContent?.trim() ?? '';
          const costText = cells[1]?.textContent?.trim() ?? '';
          const cost = parseFloat(costText.replace(/[^0-9.]/g, '')) || 0;
          if (dateText) {
            result.push({date: dateText, cost});
          }
        }
      });

      return result;
    });

    if (rows.length === 0) {
      return {status: 'no_data', period: matched, trend: []};
    }

    return {status: 'success', period: matched, trend: rows};
  });
}

function toMMDDYYYY(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${m}/${d}/${y}`;
}

interface CostDriver {
  user: string;
  approxDBU: string;
  approxCost: string;
  clusterSessions: string;
}

export async function investigateDate(date: string): Promise<{status: string; date: string; drivers: CostDriver[]}> {
  return withPage(async (page) => {
    await page.goto('/#/cost_explorer/drill_downs');

    await page.waitForFunction(() => {
      const spinner = document.querySelector('#nprogress');
      return !spinner || getComputedStyle(spinner).opacity === '0';
    });

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.locator('.component-date-picker').click();
    await page.waitForTimeout(500);

    await page.getByText('Custom Range').click();
    await page.waitForTimeout(500);

    const startInput = page.locator('input[name="daterangepicker_start"]');
    const endInput = page.locator('input[name="daterangepicker_end"]');

    const spikeDate = new Date(date);
    const dayBefore = new Date(spikeDate);
    dayBefore.setDate(dayBefore.getDate() - 1);
    const startDateStr = dayBefore.toISOString().split('T')[0];

    await startInput.click({clickCount: 3});
    await startInput.fill(toMMDDYYYY(startDateStr));

    await endInput.click({clickCount: 3});
    await endInput.fill(toMMDDYYYY(date));

    await page.getByText('Apply').click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', {name: 'Refresh'}).click();

    await page.waitForFunction(() => {
      const spinner = document.querySelector('#nprogress');
      return !spinner || getComputedStyle(spinner).opacity === '0';
    });

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const drivers = await page.evaluate(() => {
      const tables = document.querySelectorAll('table');
      for (const table of tables) {
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim());
        if (headers.some(h => h?.includes('Approx cost'))) {
          const trs = table.querySelectorAll('tbody tr');
          const result: {user: string; approxDBU: string; approxCost: string; clusterSessions: string}[] = [];

          trs.forEach((tr) => {
            const cells = tr.querySelectorAll('td');
            if (cells.length >= 3) {
              const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
              result.push({
                user: clean(cells[0]?.textContent ?? ''),
                approxDBU: clean(cells[1]?.textContent ?? ''),
                approxCost: clean(cells[2]?.textContent ?? ''),
                clusterSessions: clean(cells[3]?.textContent ?? ''),
              });
            }
          });

          return result;
        }
      }
      return [];
    });

    if (drivers.length === 0) {
      return {status: 'no_data', date, drivers: []};
    }

    return {status: 'success', date, drivers};
  });
}
