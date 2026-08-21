---
title: TTS
sidebar_position: 2
---

# TTS

Generate and manage API-created Text-to-Speech (TTS) audios. Corresponds to the `/v1/tts` API endpoints.

## List TTS audios

Returns a paginated list of API-created TTS audios belonging to the current API key's team. Audios created
by a different API key for the same team are included; audios created without an API key are not.

```typescript
const { data: audios } = await client.tts.list({
  voice: 'hajja',
  search: 'welcome',
  date_from: '2026-01-01',
  date_to: '2026-12-31',
  sort: '-created_at',
});
```

### Parameters

| Name        | Type     | Description                                                              |
|-------------|----------|----------------------------------------------------------------------------|
| `search`    | `string` | Search TTS audios by title.                                              |
| `per_page`  | `number` | Number of results per page. Defaults to 10. Between 1 and 100.           |
| `page`      | `number` | Page number to return. At least 1.                                       |
| `sort`      | `string` | Field to sort by: `created_at`, `updated_at`, or `uuid`. Prefix with `-` for descending. Defaults to `-created_at`. |
| `voice`     | `string` | Only return TTS audios generated with this voice slug.                   |
| `date_from` | `string` | Only return TTS audios created on or after this date and time.           |
| `date_to`   | `string` | Only return TTS audios created on or before this date and time.          |

## Generate a TTS audio

Converts text into speech with an available voice, charges the API key team for the usage, and associates
the generated audio with the current API key.

```typescript
const audio = await client.tts.create({
  text: 'ދިވެހިޖީޕީޓީއަށް މަރުޙަބާ',
  voice: 'hajja',
});

console.log(audio.audio_url);
```

### Parameters

| Name    | Type     | Required | Description                                                      |
|---------|----------|----------|--------------------------------------------------------------------|
| `text`  | `string` | Yes      | The text to convert into speech. Up to 10,000 characters.        |
| `voice` | `string` | Yes      | The slug of an available voice, from [`client.voices.list()`](./voices.md). |

Throws an [`InsufficientCreditsError`](./errors.md) if the team has no credits left, and a
[`ServerError`](./errors.md) if the speech provider fails to generate the audio.

## Get a TTS audio

Returns one API-created TTS audio belonging to the current API key's team.

```typescript
const audio = await client.tts.get('c6fc95bf-3f1d-4202-b31e-3e79753a1ef5');
```

## Update a TTS audio

Updates the title of an API-created TTS audio belonging to the current API key's team.

```typescript
const audio = await client.tts.update('c6fc95bf-3f1d-4202-b31e-3e79753a1ef5', {
  title: 'A friendlier title',
});
```

## Delete a TTS audio

Deletes an API-created TTS audio belonging to the current API key's team. Resolves with `undefined` on
success.

```typescript
await client.tts.delete('c6fc95bf-3f1d-4202-b31e-3e79753a1ef5');
```

## The TTS audio object

```typescript
interface TTSAudio {
  uuid: string;
  title: string;
  text: string;
  normalized_text: string;
  duration: number;
  audio_url: string;
  voice: string;
  usage: Usage;
  created_at: string;
  updated_at: string;
}
```
