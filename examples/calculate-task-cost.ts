import { DhivehiGPT } from '@javaabu/dhivehigpt-sdk';

const client = new DhivehiGPT({ apiKey: process.env.DHIVEHIGPT_API_KEY! });

async function main() {
  const { data: tasks } = await client.tasks.list({ platform: 'tts' });
  console.log('Available TTS tasks:', tasks.map((task) => task.slug).join(', '));

  const calculation = await client.tasks.calculate({
    task: 'audio_generation',
    units: 5000,
  });

  console.log(`Cost for 5000 characters: ${calculation.charged_credits} credits`);
  console.log(`Can proceed with current balance: ${calculation.can_proceed}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
