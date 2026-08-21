---
title: Installation & Setup
sidebar_position: 1.2
---

# Installation

Install the NPM package:

```bash
npm install @javaabu/dhivehigpt-sdk --save
```

# Setup

Create a client instance with your API key. You can generate an API key from the
[**API Keys**](https://dhivehigpt.com/team/api-keys) page of your team account.

:::info
You need a DhivehiGPT **team account with an active subscription**. Only **team owners and admins** can
generate API keys.
:::

If you set the `DHIVEHIGPT_API_KEY` environment variable, the client picks it up automatically — no need to
pass it explicitly:

```typescript
import { DhivehiGPT } from '@javaabu/dhivehigpt-sdk';

const client = new DhivehiGPT();
```

Or pass it explicitly, which always takes priority over the environment variable:

```typescript
const client = new DhivehiGPT({
  apiKey: process.env.DHIVEHIGPT_API_KEY,
});
```

The same works from CommonJS:

```javascript
const { DhivehiGPT } = require('@javaabu/dhivehigpt-sdk');

const client = new DhivehiGPT(); // reads DHIVEHIGPT_API_KEY
```

:::caution
Never expose your API key in client-side (browser) code. This SDK is intended for use in server-side
applications, where your API key can be kept secret.
:::

See [Configuration](./configuration.md) for all the available client options.
