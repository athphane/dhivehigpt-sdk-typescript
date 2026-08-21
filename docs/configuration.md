---
title: Configuration
sidebar_position: 1.3
---

# Configuration

The `DhivehiGPT` client accepts the following options:

| Option      | Type                     | Required | Default                        | Description                                                                 |
|-------------|--------------------------|----------|---------------------------------|-------------------------------------------------------------------------------|
| `apiKey`    | `string`                 | No       | `process.env.DHIVEHIGPT_API_KEY` | Your DhivehiGPT API key. Falls back to the `DHIVEHIGPT_API_KEY` environment variable; throws if neither is set. |
| `baseUrl`   | `string`                 | No       | `https://api.dhivehigpt.com`    | Override the API base URL, e.g. for testing against a staging environment.  |
| `apiVersion`| `string`                 | No       | `v1`                             | Override the API version path segment, e.g. `v2`.                           |
| `timeoutMs` | `number`                 | No       | No timeout                      | Aborts a request if it takes longer than this many milliseconds.            |
| `headers`   | `Record<string, string>` | No       | `{}`                             | Additional headers sent with every request.                                 |
| `fetch`     | `typeof fetch`           | No       | The global `fetch`               | A custom `fetch` implementation, e.g. for older runtimes or for testing.    |

```typescript
import { DhivehiGPT } from '@javaabu/dhivehigpt-sdk';

const client = new DhivehiGPT({
  apiKey: process.env.DHIVEHIGPT_API_KEY, // optional; read from the same env var automatically
  apiVersion: 'v1', // optional, this is the default
  timeoutMs: 10_000,
  headers: {
    'X-Request-Source': 'my-app',
  },
});
```

## API key resolution

`apiKey` is optional. When omitted, the client reads it from the `DHIVEHIGPT_API_KEY` environment variable:

```typescript
// DHIVEHIGPT_API_KEY=sk_... in the environment
const client = new DhivehiGPT();
```

An explicitly passed `apiKey` always takes priority over the environment variable. If neither is available,
the constructor throws.

You can generate an API key from the [**API Keys**](https://dhivehigpt.com/team/api-keys) page of your team
account. You need a DhivehiGPT **team account with an active subscription**, and only **team owners and
admins** can generate API keys.

## Rate limits

All DhivehiGPT API routes are limited to 60 requests per minute per API key. Exceeding this limit causes the
SDK to throw a [`RateLimitError`](./modules/errors.md).
