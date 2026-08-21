import { DhivehiGPT } from '@javaabu/dhivehigpt-sdk';

const client = new DhivehiGPT({ apiKey: process.env.DHIVEHIGPT_API_KEY! });

async function main() {
  const { data: voices, meta } = await client.voices.list({
    gender: 'female',
    per_page: 5,
  });

  console.log(`Showing ${voices.length} of ${meta.total} female voices:\n`);

  for (const voice of voices) {
    const premium = voice.is_premium ? ' (premium)' : '';
    console.log(`- ${voice.name} [${voice.slug}]${premium} — ${voice.rate} credits/${voice.unit_charged}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
