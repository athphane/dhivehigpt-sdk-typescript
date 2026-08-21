---
title: Introduction
sidebar_position: 1.0
---

# DhivehiGPT SDK

[DhivehiGPT SDK](https://github.com/Javaabu/dhivehigpt-sdk-typescript) is a lightweight, dependency-free TypeScript/JavaScript SDK
for the [DhivehiGPT API](https://dhivehigpt.com/docs), letting you list voices, generate and manage
text-to-speech audio, check your team's subscription balance, and calculate task costs.

It works in any modern server-side JavaScript runtime with a global `fetch` (Node.js 18+, Deno, Bun, Cloudflare Workers, etc.)
and ships as both an ES module and a CommonJS module, with full TypeScript type declarations.

```javascript
import { DhivehiGPT } from '@javaabu/dhivehigpt-sdk';

const client = new DhivehiGPT({ apiKey: process.env.DHIVEHIGPT_API_KEY });

const audio = await client.tts.generate({
  text: 'ދިވެހިޖީޕީޓީއަށް މަރުޙަބާ',
  voice: 'hajja',
});

console.log(audio.audio_url);
```
