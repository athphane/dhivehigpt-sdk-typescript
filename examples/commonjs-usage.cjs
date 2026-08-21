const { DhivehiGPT } = require('@javaabu/dhivehigpt-sdk');

const client = new DhivehiGPT({ apiKey: process.env.DHIVEHIGPT_API_KEY });

async function main() {
  const { data: voices } = await client.voices.list({ per_page: 3 });

  for (const voice of voices) {
    console.log(`${voice.name} (${voice.slug})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
