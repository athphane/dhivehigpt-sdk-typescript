import { describe, expect, it } from 'vitest';
import { DhivehiGPT } from '../../src/index.js';
import { ValidationError } from '../../src/errors.js';
import { createMockFetch } from '../helpers/mockFetch.js';

const taskFixture = {
  name: 'ލިޔުމުން ކިޔުން',
  description: null,
  slug: 'audio_generation',
  order_column: 7,
  platform: 'tts',
  unit_charged: 'character',
  rate: 0.01,
};

describe('Tasks resource', () => {
  it('lists tasks filtered by platform', async () => {
    const { fetch, calls } = createMockFetch([
      {
        status: 200,
        body: {
          data: [taskFixture],
          links: { first: null, last: null, prev: null, next: null },
          meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            links: [],
            path: 'https://api.dhivehigpt.com/v1/tasks',
            per_page: 10,
            to: 1,
            total: 1,
          },
        },
      },
    ]);
    const client = new DhivehiGPT({ apiKey: 'test-key', fetch });

    const result = await client.tasks.list({ platform: 'tts' });

    expect(calls[0]?.url).toContain('platform=tts');
    expect(result.data).toEqual([taskFixture]);
  });

  it('gets a single task by slug', async () => {
    const { fetch, calls } = createMockFetch([{ status: 200, body: { data: taskFixture } }]);
    const client = new DhivehiGPT({ apiKey: 'test-key', fetch });

    const task = await client.tasks.get('audio_generation');

    expect(calls[0]?.url).toBe('https://api.dhivehigpt.com/v1/tasks/audio_generation');
    expect(task).toEqual(taskFixture);
  });

  it('calculates the cost of a task', async () => {
    const calculation = {
      task: taskFixture,
      units: 1000,
      units_used: 1000,
      units_charged: 1000,
      charged_credits: 10,
      credits_available: 5533.45,
      can_proceed: true,
    };
    const { fetch, calls } = createMockFetch([{ status: 200, body: calculation }]);
    const client = new DhivehiGPT({ apiKey: 'test-key', fetch });

    const result = await client.tasks.calculate({ task: 'audio_generation', units: 1000 });

    expect(calls[0]?.method).toBe('POST');
    expect(calls[0]?.body).toEqual({ task: 'audio_generation', units: 1000 });
    expect(result).toEqual(calculation);
  });

  it('throws ValidationError for an invalid task slug', async () => {
    const { fetch } = createMockFetch([
      {
        status: 422,
        body: {
          message: 'The selected task is invalid.',
          errors: { task: ['The selected task is invalid.'] },
        },
      },
    ]);
    const client = new DhivehiGPT({ apiKey: 'test-key', fetch });

    const promise = client.tasks.calculate({ task: 'nonexistent', units: 1 });

    await expect(promise).rejects.toBeInstanceOf(ValidationError);
    await promise.catch((error: ValidationError) => {
      expect(error.errors).toEqual({ task: ['The selected task is invalid.'] });
    });
  });
});
