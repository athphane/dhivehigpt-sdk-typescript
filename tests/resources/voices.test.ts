import { describe, expect, it } from 'vitest';
import { DhivehiGPT } from '../../src/index.js';
import { NotFoundError } from '../../src/errors.js';
import { createMockFetch } from '../helpers/mockFetch.js';

const voiceFixture = {
  name: 'ޙައްޖަ',
  slug: 'hajja',
  gender: 'female',
  age_group: 'thirties',
  is_premium: false,
  audio_sample_url: 'https://dvgpt.s3.ap-southeast-1.amazonaws.com/hajja.wav',
  unit_charged: 'character',
  rate: 0.01,
};

describe('Voices resource', () => {
  it('lists voices with query filters', async () => {
    const { fetch, calls } = createMockFetch([
      {
        status: 200,
        body: {
          data: [voiceFixture],
          links: { first: null, last: null, prev: null, next: null },
          meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            links: [],
            path: 'https://api.dhivehigpt.com/v1/voices',
            per_page: 10,
            to: 1,
            total: 1,
          },
        },
      },
    ]);
    const client = new DhivehiGPT({ apiKey: 'test-key', fetch });

    const result = await client.voices.list({ gender: 'female', is_premium: false });

    expect(calls[0]?.url).toContain('gender=female');
    expect(calls[0]?.url).toContain('is_premium=false');
    expect(result.data).toEqual([voiceFixture]);
  });

  it('gets a single voice by slug', async () => {
    const { fetch, calls } = createMockFetch([{ status: 200, body: { data: voiceFixture } }]);
    const client = new DhivehiGPT({ apiKey: 'test-key', fetch });

    const voice = await client.voices.get('hajja');

    expect(calls[0]?.url).toBe('https://api.dhivehigpt.com/v1/voices/hajja');
    expect(voice).toEqual(voiceFixture);
  });

  it('url-encodes the slug', async () => {
    const { fetch, calls } = createMockFetch([{ status: 200, body: { data: voiceFixture } }]);
    const client = new DhivehiGPT({ apiKey: 'test-key', fetch });

    await client.voices.get('a slug/with special');

    expect(calls[0]?.url).toBe(
      'https://api.dhivehigpt.com/v1/voices/a%20slug%2Fwith%20special'
    );
  });

  it('throws NotFoundError for an unknown slug', async () => {
    const { fetch } = createMockFetch([{ status: 404, body: { message: 'Not found' } }]);
    const client = new DhivehiGPT({ apiKey: 'test-key', fetch });

    await expect(client.voices.get('unknown')).rejects.toBeInstanceOf(NotFoundError);
  });
});
