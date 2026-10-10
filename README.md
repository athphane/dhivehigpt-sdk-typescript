# DhivehiGPT TypeScript SDK

[![Tests](https://github.com/Javaabu/dhivehigpt-sdk-typescript/actions/workflows/tests.yml/badge.svg)](https://github.com/Javaabu/dhivehigpt-sdk-typescript/actions/workflows/tests.yml)
[![Coverage](./badges/coverage.svg)](https://github.com/Javaabu/dhivehigpt-sdk-typescript/actions/workflows/tests.yml)
[![npm version](https://img.shields.io/npm/v/%40javaabu%2Fdhivehigpt-sdk.svg)](https://www.npmjs.com/package/@javaabu/dhivehigpt-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A lightweight, dependency-free TypeScript/JavaScript SDK for the [DhivehiGPT API](https://dhivehigpt.com/docs) — voices, text-to-speech, subscription balance, and task pricing.

Works in any modern Node.js server (18+) and in any JavaScript runtime with a global `fetch`. Ships as both ESM and CommonJS with full TypeScript types, and has zero runtime dependencies.

## Installation

```bash
npm install @javaabu/dhivehigpt-sdk
```

You'll need an API key, generated from the [**API Keys**](https://dhivehigpt.com/team/api-keys) page of your
team account. This requires a DhivehiGPT **team account with an active subscription**, and only **team
owners and admins** can generate API keys.

## Quick start

```ts
import { DhivehiGPT } from '@javaabu/dhivehigpt-sdk';

// Reads the API key from the DHIVEHIGPT_API_KEY environment variable automatically.
const client = new DhivehiGPT();

// List available voices
const { data: voices } = await client.voices.list({ gender: 'female' });

// Generate a TTS audio
const audio = await client.tts.generate({
  text: 'ދިވެހިޖީޕީޓީއަށް މަރުޙަބާ',
  voice: 'hajja',
});

console.log(audio.audio_url);
```

CommonJS works the same way:

```js
const { DhivehiGPT } = require('@javaabu/dhivehigpt-sdk');

const client = new DhivehiGPT(); // also reads DHIVEHIGPT_API_KEY
```

## Usage

The client exposes one namespace per API resource:

```ts
client.voices.list(params?);        // GET /v1/voices
client.voices.get(slug);            // GET /v1/voices/{slug}

client.tts.list(params?);             // GET /v1/tts
client.tts.generate({ text, voice }); // POST /v1/tts
client.tts.get(uuid);                 // GET /v1/tts/{uuid}
client.tts.update(uuid, { title });   // PUT /v1/tts/{uuid}
client.tts.delete(uuid);              // DELETE /v1/tts/{uuid}

client.subscriptions.getBalance();  // GET /v1/balance

client.tasks.list(params?);              // GET /v1/tasks
client.tasks.get(slug);                  // GET /v1/tasks/{slug}
client.tasks.calculate({ task, units }); // POST /v1/tasks/calculate
```

### Error handling

Every non-2xx response throws a typed error you can catch:

```ts
import { AuthenticationError, InsufficientCreditsError, ValidationError } from '@javaabu/dhivehigpt-sdk';

try {
  await client.tts.generate({ text: '...', voice: 'hajja' });
} catch (error) {
  if (error instanceof InsufficientCreditsError) {
    // team is out of credits
  } else if (error instanceof AuthenticationError) {
    // missing, invalid, or revoked API key
  } else if (error instanceof ValidationError) {
    console.log(error.errors); // field-level validation errors
  } else {
    throw error;
  }
}
```

### Client options

```ts
new DhivehiGPT({
  apiKey: '...',            // optional if DHIVEHIGPT_API_KEY is set in the environment
  baseUrl: '...',           // defaults to https://api.dhivehigpt.com
  apiVersion: 'v1',         // defaults to "v1"
  timeoutMs: 10_000,        // optional request timeout
  headers: { 'X-Foo': 1 },  // optional extra headers on every request
  fetch: myFetch,           // optional custom fetch implementation
});
```

## Full documentation

The full documentation, including every resource, type, and error, is published at
**[docs.javaabu.com/docs/dhivehigpt-sdk-typescript](https://docs.javaabu.com/dhivehigpt-sdk-typescript)**.

See also the [examples](examples) directory for runnable sample scripts.

Find yourself stuck using the package? Found a bug? Do you have general questions or suggestions for improving this package? Feel free to create an [issue](../../issues) on GitHub, we'll try to address it as soon as possible.

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Security

If you discover any security related issues, please email [info@javaabu.com](mailto:info@javaabu.com) instead of using the issue tracker.

## Credits

- [Javaabu Pvt. Ltd.](https://github.com/javaabu)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.
