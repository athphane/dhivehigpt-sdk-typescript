import { DhivehiGPT } from '@javaabu/dhivehigpt-sdk';

const client = new DhivehiGPT({ apiKey: process.env.DHIVEHIGPT_API_KEY! });

async function main() {
  const audio = await client.tts.generate({
    text: 'ދިވެހިޖީޕީޓީއަށް މަރުޙަބާ',
    voice: 'hajja',
  });

  console.log('Generated audio:', audio.uuid);
  console.log('Download URL:', audio.audio_url);
  console.log('Charged credits:', audio.usage.charged_credits);

  // Rename it
  const renamed = await client.tts.update(audio.uuid, { title: 'Welcome message' });
  console.log('Renamed to:', renamed.title);

  // Clean up
  await client.tts.delete(audio.uuid);
  console.log('Deleted.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
