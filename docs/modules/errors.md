---
title: Errors
sidebar_position: 5
---

# Errors

Every non-2xx response from the DhivehiGPT API is thrown as an error. All error classes extend the base
`DhivehiGPTError`, so you can always catch that as a fallback.

```typescript
import { DhivehiGPTError } from '@javaabu/dhivehigpt-sdk';

try {
  await client.tts.generate({ text: '...', voice: 'unknown-voice' });
} catch (error) {
  if (error instanceof DhivehiGPTError) {
    console.log(error.status, error.message, error.body);
  }
}
```

## Error classes

| Class                       | HTTP status | Thrown when                                                              |
|------------------------------|-------------|----------------------------------------------------------------------------|
| `AuthenticationError`        | 401         | The `X-Api-Key` header is missing, invalid, or has been revoked.         |
| `InsufficientCreditsError`   | 403         | The API key's team doesn't have enough credits to complete the request.  |
| `NotFoundError`               | 404         | The requested resource doesn't exist, or doesn't belong to your team.    |
| `ValidationError`             | 422         | The request body or parameters failed validation.                        |
| `RateLimitError`              | 429         | The API key has exceeded 60 requests per minute.                         |
| `ServerError`                 | 5xx         | An unexpected error occurred upstream (e.g. the speech provider failed). |
| `DhivehiGPTError`             | any         | Base class for all of the above; also used for any unmapped status code. |

## Properties

Every error exposes:

- `status: number` — the HTTP status code.
- `message: string` — the API's error message.
- `body: { message: string; errors?: Record<string, string[]> } | undefined` — the raw parsed response body.

`ValidationError` additionally exposes an `errors` getter with field-level validation messages:

```typescript
import { ValidationError } from '@javaabu/dhivehigpt-sdk';

try {
  await client.tasks.calculate({ task: 'not-a-real-task', units: 10 });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(error.errors); // { task: ['The selected task is invalid.'] }
  }
}
```
