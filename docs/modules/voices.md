---
title: Voices
sidebar_position: 1
---

# Voices

Browse the available Text-to-Speech (TTS) voices available for audio generation. Corresponds to the
`/v1/voices` API endpoints.

## List voices

Returns a paginated list of available voices. Results can be filtered by age group, gender, premium status,
or a search term, and sorted.

```typescript
const { data: voices, meta } = await client.voices.list({
  gender: 'female',
  age_group: 'thirties',
  is_premium: false,
  search: 'zee',
  sort: '-name',
  per_page: 20,
  page: 1,
});
```

### Parameters

| Name         | Type      | Description                                                                 |
|--------------|-----------|-------------------------------------------------------------------------------|
| `search`     | `string`  | Search available voices by their name or slug.                              |
| `per_page`   | `number`  | Number of results per page. Defaults to 10. Between 1 and 100.              |
| `page`       | `number`  | Page number to return. At least 1.                                          |
| `sort`       | `string`  | Field to sort by: `name`, `slug`, `id`, or `order_column`. Prefix with `-` for descending. |
| `is_premium` | `boolean` | Only return premium or non-premium voices.                                  |
| `gender`     | `string`  | Only return voices with this gender: `female` or `male`.                    |
| `age_group`  | `string`  | Only return voices with this age group slug (`ones`, `tens`, `twenties`, `thirties`, `fourties`, `fifties`, `sixties`, `seventies`). |

### Returns

A `PaginatedResponse<Voice>`, i.e. `{ data: Voice[], links, meta }`.

## Get a voice

Returns a single available voice identified by its slug, including its sample audio and pricing details.

```typescript
const voice = await client.voices.get('hajja');
```

### Returns

A `Voice` object:

```typescript
interface Voice {
  name: string;
  slug: string;
  gender: 'female' | 'male';
  age_group: 'ones' | 'tens' | 'twenties' | 'thirties' | 'fourties' | 'fifties' | 'sixties' | 'seventies';
  is_premium: boolean;
  audio_sample_url: string;
  unit_charged: string;
  rate: number;
}
```

Throws a [`NotFoundError`](./errors.md) if no voice exists with the supplied slug.
