import {getDailyCostTrend, investigateDate} from './tools.ts';

const [command, ...args] = process.argv.slice(2);

try {
  let result: unknown;

  if (command === 'trend') {
    const period = args[0] || 'Last 30 days';
    result = await getDailyCostTrend(period);
  } else if (command === 'investigate') {
    const date = args[0];
    if (!date) throw new Error('date argument required');
    result = await investigateDate(date);
  } else {
    throw new Error(`Unknown command: ${command}. Use "trend" or "investigate".`);
  }

  console.log(JSON.stringify(result));
} catch (err: any) {
  console.log(JSON.stringify({status: 'error', message: err.message}));
  process.exit(1);
}
