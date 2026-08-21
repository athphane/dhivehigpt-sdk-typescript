import { DhivehiGPT } from '@javaabu/dhivehigpt-sdk';

const client = new DhivehiGPT({ apiKey: process.env.DHIVEHIGPT_API_KEY! });

async function main() {
  const balance = await client.subscriptions.getBalance();

  console.log(`Team: ${balance.team.name} (${balance.team.used_seats} seats used)`);

  if (!balance.subscription || !balance.billing_period) {
    console.log('No active subscription.');
    return;
  }

  console.log(`Plan: ${balance.subscription.plan.name}`);
  console.log(
    `Credits remaining this period: ${balance.billing_period.balance} / ${balance.billing_period.total_credits}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
