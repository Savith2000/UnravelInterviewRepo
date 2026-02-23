# Cost Spike Investigator Agent

AI agent that detects cost spikes on the Unravel dashboard and explains what caused them. Built with Google ADK + Playwright.

## Setup

Requires Node.js v24+ (`nvm install 24`).

```bash
npm install
```

Add your Gemini API key to `.env`:

```
GEMINI_API_KEY="your-key-here"
```

Make sure the Playwright auth state is fresh by running a test from the project root first:

```bash
cd ../..
npx playwright test tests/task1.spec.ts
```

## Run

```bash
npx adk web
```

Open http://localhost:8000 and try:

- "What were the cost spikes last month?"
- "Investigate cost trends for the last 7 days"
- "Why was cost high last week?"
