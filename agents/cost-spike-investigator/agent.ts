import {FunctionTool, LlmAgent} from '@google/adk';
import {z} from 'zod';
import {execFile} from 'child_process';
import path from 'path';

function runTool(args: string[]): Promise<Record<string, unknown>> {
  const projectRoot = path.resolve(process.cwd(), '..', '..');
  const runner = path.join(projectRoot, 'playwright-tools', 'runner.ts');
  return new Promise((resolve) => {
    execFile('node', ['--experimental-strip-types', runner, ...args], {
      cwd: projectRoot,
      timeout: 120_000,
    }, (_err, stdout) => {
      try {
        resolve(JSON.parse(stdout));
      } catch {
        resolve({status: 'error', message: stdout?.slice(0, 300) || _err?.message || 'unknown error'});
      }
    });
  });
}

const getDailyCostTrendTool = new FunctionTool({
  name: 'get_daily_cost_trend',
  description: 'Reads the Compute cost history table from the Unravel Cost Explorer Trends page. Returns daily cost data sorted by highest cost first. Each entry has a date (YYYY-MM-DD) and a total cost in USD. The period parameter controls the time range.',
  parameters: z.object({
    period: z.string()
      .describe('The time range to analyze. Must be one of: "Last 7 days", "Last 14 days", "Last 30 days", "Last 90 days". Defaults to "Last 30 days".')
      .default('Last 30 days'),
  }),
  execute: async ({period}) => {
    return await runTool(['trend', period]);
  },
});

const investigateDateTool = new FunctionTool({
  name: 'investigate_date',
  description: 'Drills down into a specific date on the Unravel Cost Explorer Drill-Downs page. Sets the date range to the day before through the target date, then returns the chargeback results grouped by User, including Approx DBU, Approx cost (with percentage), and Cluster sessions.',
  parameters: z.object({
    date: z.string().describe('The date to investigate in YYYY-MM-DD format.'),
  }),
  execute: async ({date}) => {
    return await runTool(['investigate', date]);
  },
});

export const rootAgent = new LlmAgent({
  name: 'cost_spike_investigator',
  model: 'gemini-2.5-flash',
  description: 'A FinOps cost analyst that investigates cost spikes on the Unravel dashboard.',
  instruction: `You are a FinOps cost analyst. Your job is to investigate cost spikes on the Unravel dashboard.

When asked about costs or spikes:
1. Determine the time period the user is asking about. If they say "last week" use "Last 7 days", "past two weeks" use "Last 14 days", "last month" use "Last 30 days", "last quarter" use "Last 90 days". Default to "Last 30 days" if unspecified.
2. Call get_daily_cost_trend with that period to get the daily cost data.
3. Identify which day had the highest cost — that is the spike.
4. Call investigate_date with that spike date to find out who/what drove the cost.
5. Write a clear explanation that includes:
   - The spike date and its total cost
   - How it compares to other days (e.g. average or next-highest)
   - The top cost drivers (users) with their costs and percentages
   - A brief recommendation on what to investigate next

Never invent data. Only reference what the tools returned.
If a tool returns no data, say so honestly.`,
  tools: [getDailyCostTrendTool, investigateDateTool],
});
