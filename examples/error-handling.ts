import {
  DhivehiGPT,
  DhivehiGPTError,
  InsufficientCreditsError,
  ValidationError,
} from '@javaabu/dhivehigpt-sdk';

const client = new DhivehiGPT({ apiKey: process.env.DHIVEHIGPT_API_KEY! });

async function main() {
  try {
    await client.tasks.calculate({ task: 'not-a-real-task-slug', units: 10 });
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log('Validation failed:', error.errors);
    } else if (error instanceof InsufficientCreditsError) {
      console.log('Not enough credits.');
    } else if (error instanceof DhivehiGPTError) {
      console.log(`API error (${error.status}): ${error.message}`);
    } else {
      throw error;
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
