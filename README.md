# Playwright Interview – Take-Home

## Project Setup

```bash
npm install
npx playwright install
```

### Running Tests

**Recommended: Playwright UI (spec list + click to run)**

```bash
npm run test:ui
```

Global setup (login) runs once, then the Playwright editor opens with the spec list. Click a spec or test to run it; nothing runs automatically. Only Chromium is configured.

**Other ways to run:**

- **Headed (visible browser):** `npm run test:headed`
- **Headless (CI):** `npm test`
- **Single file:** `npx playwright test tests/task1.spec.ts`

### Auth

Login runs once in `global-setup.ts` and the session is saved to `playwright/.auth/user.json`. All tests start already logged in.

- **URL:** https://playground-databricks.unraveldata.com/#/
- **Credentials:** `admin` / `unraveldata`

---

## Agent Setup (Cost Spike Investigator)

The agent requires **Node.js v24+** because it uses `--experimental-strip-types` to run TypeScript directly.

```bash
nvm install 24
nvm use 24
```

Add your Gemini API key to `agents/cost-spike-investigator/.env`:

```
GEMINI_API_KEY="your-key-here"
```

Install agent dependencies:

```bash
cd agents/cost-spike-investigator
npm install
```

Before running the agent, make sure the auth session is fresh by running a test from the project root:

```bash
cd ../..
npx playwright test tests/task1.spec.ts
```

Then start the agent:

```bash
cd agents/cost-spike-investigator
npx adk web
```

Open http://localhost:8000 and try prompts like:

- "What were the cost spikes last month?"
- "What caused the spike last week?"
- "Investigate cost trends for the last 90 days"

---

## Demo Video

https://www.youtube.com/watch?v=IKERuso8ajo

**Timestamps:**

- 00:00:41 - Task 1
- 00:01:31 - Task 2
- 00:03:05 - Task 3
- 00:04:55 - Task 4
- 00:06:41 - Task 5

---

## Understanding the Unravel Platform

The test target is Unravel Data, a FinOps and observability platform for Databricks. Here is what each section of the application does:

**Home** gives you a high-level snapshot of your Databricks environment, including total spend, cost rating, savings opportunities, and daily cost trends. It helps you quickly see whether your money is mostly coming from interactive clusters or automated jobs and whether there is obvious room for improvement.

**Cost Explorer** lets you break down spending by team, user, workspace, or time period to understand exactly where money is going. It is where you track budgets, monitor burn rate, and drill into specific clusters or workloads that are driving cost.

**Compute** shows all your clusters along with how long they ran, how many DBUs they used, and how much they cost. It helps you identify idle clusters, oversized machines, or infrastructure that may be wasting money.

**Workflows** focuses on jobs and job runs, showing which ones failed, ran slowly, or used more resources than necessary. It connects technical issues in workloads to real cost and productivity impact so engineers know what to fix first.

**SQL** highlights warehouse activity and query performance, including which queries are slow or expensive. It helps you understand how analytics workloads contribute to overall cost and where queries may need optimization.

**Data** shows how tables and datasets are being used across workspaces, including access frequency and user activity. It helps you see which data is heavily used, rarely touched, or potentially unmanaged.

**Reports** allows you to generate and share summaries of cost and optimization insights. It turns dashboard metrics into something you can send to stakeholders or leadership.

**AutoActions** lets you automatically enforce rules, such as preventing wasteful configurations or responding to cost thresholds. It moves you from just observing problems to automatically fixing or controlling them.

---

## What the Agent Does

The Cost Spike Investigator is an AI agent that automatically detects and explains cost spikes on the Unravel dashboard. Instead of a human manually clicking through Cost Explorer to find what caused a spike, this agent does it autonomously.

It is built with three layers:

1. **Playwright scrapers** (`playwright-tools/tools.ts`) — two functions that each launch a headless browser, navigate to a specific Unravel page, and extract structured data. `getDailyCostTrend` scrapes the Cost Explorer Trends table to get daily costs sorted by highest first. `investigateDate` scrapes the Cost Explorer Drill-Downs page for a specific day to find which users and clusters drove the cost.

2. **CLI runner** (`playwright-tools/runner.ts`) — a command-line wrapper that lets the scrapers be called as a subprocess, outputting JSON to stdout.

3. **LLM agent** (`agents/cost-spike-investigator/agent.ts`) — a Google ADK agent powered by Gemini 2.5 Flash. It has two tools registered (the scrapers above) and a system prompt that tells it: get the trend data, find the spike day, drill into that day, and write a summary with the top cost drivers and a recommendation.



---

## Other Agent Ideas

Here are a few more agents that could be built with the same pattern of Playwright scrapers plus an LLM:

**Idle Cluster Reporter** — Scrapes the Compute page for clusters with long runtimes but low DBU usage, identifies clusters that are likely idle or over-provisioned, and generates a report recommending which ones to downsize or terminate.

**Failed Job Summarizer** — Scrapes the Workflows page for jobs with recent failures, collects the failure reasons and affected runs, and produces a daily digest summarizing what failed, how often, and which failures are recurring versus one-off.

**Budget Alert Agent** — Scrapes the Cost Explorer page daily, compares current spend against a configured monthly budget, and generates a natural-language alert when spending is on pace to exceed the budget, including which teams or users are contributing most to the overage.

