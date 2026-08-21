import { describe, expect, it } from 'vitest';
import { DhivehiGPT } from '../../src/index.js';
import { InsufficientCreditsError } from '../../src/errors.js';
import { createMockFetch } from '../helpers/mockFetch.js';

const audioFixture = {
  uuid: 'b7d7a270-7dc3-46c9-be27-d68f0ce55f36',
  title: 'ދިވެހިޖީޕީޓީއަށް މަރުޙަބާ',
  text: 'ދިވެހިޖީޕީޓީއަށް މަރުޙަބާ',
  normalized_text: 'ދިވެހިޖީޕީޓީއަށް މަރުހަބާ',
  duration: 1860,
  audio_url: 'https://dvgpt.s3.ap-southeast-1.amazonaws.com/b7d7a270.wav',
  voice: 'hajja',
  usage: {
    uuid: '0b6370c1-08a4-4f4a-86aa-11564739407c',
    task: 'audio_generation',
    unit: 'character',
    status: 'completed',
    usage_units: 25,
    charged_credits: 0.25,
    duration: 18,
    started_at: '2026-08-21T18:43:21+05:00',
    completed_at: '2026-08-21T18:43:39+05:00',
    created_at: '2026-08-21T18:43:21+05:00',
  },
  created_at: '2026-08-21T18:43:21+05:00',
  updated_at: '2026-08-21T18:43:39+05:00',
};

describe('TTS resource', () => {
  it('lists TTS audios', async () => {
    const { fetch, calls } = createMockFetch([
      {
        status: 200,
        body: {
          data: [audioFixture],
          links: { first: null, last: null, prev: null, next: null },
          meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            links: [],
            path: 'https://api.dhivehigpt.com/v1/tts',
            per_page: 10,
            to: 1,
            total: 1,
          },
        },
      },
    ]);
    const client = new DhivehiGPT({ apiKey: 'test-key', fetch });

    const result = await client.tts.list({ voice: 'hajja' });

    expect(calls[0]?.url).toContain('voice=hajja');
    expect(result.data).toEqual([audioFixture]);
  });

  it('creates a TTS audio', async () => {
    const { fetch, calls } = createMockFetch([{ status: 201, body: { data: audioFixture } }]);
    const client = new DhivehiGPT({ apiKey: 'test-key', fetch });

    const audio = await client.tts.create({ text: 'ދިވެހިޖީޕީޓީއަށް މަރުޙަބާ', voice: 'hajja' });

    expect(calls[0]?.method).toBe('POST');
    expect(calls[0]?.body).toEqual({ text: 'ދިވެހިޖީޕީޓީއަށް މަރުޙަބާ', voice: 'hajja' });
    expect(audio).toEqual(audioFixture);
  });

  it('throws InsufficientCreditsError when the team has no credits', async () => {
    const { fetch } = createMockFetch([
      { status: 403, body: { message: "You don't have any credits available." } },
    ]);
    const client = new DhivehiGPT({ apiKey: 'test-key', fetch });

    await expect(
      client.tts.create({ text: 'hi', voice: 'hajja' })
    ).rejects.toBeInstanceOf(InsufficientCreditsError);
  });

  it('gets a single TTS audio', async () => {
    const { fetch, calls } = createMockFetch([{ status: 200, body: { data: audioFixture } }]);
    const client = new DhivehiGPT({ apiKey: 'test-key', fetch });

    const audio = await client.tts.get(audioFixture.uuid);

    expect(calls[0]?.url).toBe(`https://api.dhivehigpt.com/v1/tts/${audioFixture.uuid}`);
    expect(audio).toEqual(audioFixture);
  });

  it('updates the title of a TTS audio', async () => {
    const updated = { ...audioFixture, title: 'އެހެން ނަމެއް' };
    const { fetch, calls } = createMockFetch([{ status: 200, body: { data: updated } }]);
    const client = new DhivehiGPT({ apiKey: 'test-key', fetch });

    const audio = await client.tts.update(audioFixture.uuid, { title: 'އެހެން ނަމެއް' });

    expect(calls[0]?.method).toBe('PUT');
    expect(calls[0]?.body).toEqual({ title: 'އެހެން ނަމެއް' });
    expect(audio.title).toBe('އެހެން ނަމެއް');
  });

  it('deletes a TTS audio and resolves with no content', async () => {
    const { fetch, calls } = createMockFetch([{ status: 204 }]);
    const client = new DhivehiGPT({ apiKey: 'test-key', fetch });

    const result = await client.tts.delete(audioFixture.uuid);

    expect(calls[0]?.method).toBe('DELETE');
    expect(result).toBeUndefined();
  });
});
