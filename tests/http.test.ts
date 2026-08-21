import { describe, expect, it, vi } from 'vitest';
import { HttpClient, type FetchLike } from '../src/http.js';
import {
  AuthenticationError,
  InsufficientCreditsError,
  NotFoundError,
  RateLimitError,
  ServerError,
  ValidationError,
} from '../src/errors.js';
import { createMockFetch } from './helpers/mockFetch.js';

function makeClient(responses: Parameters<typeof createMockFetch>[0]) {
  const { fetch, calls } = createMockFetch(responses);
  const http = new HttpClient({
    apiKey: 'test-key',
    baseUrl: 'https://api.dhivehigpt.com',
    apiVersion: 'v1',
    fetch,
  });
  return { http, calls };
}

describe('HttpClient', () => {
  it('serializes query parameters, skipping null/undefined values', async () => {
    const { http, calls } = makeClient([{ status: 200, body: { data: [] } }]);

    await http.request('/voices', {
      query: { search: 'zee', per_page: 10, is_premium: undefined, gender: null as never },
    });

    expect(calls[0]?.url).toBe(
      'https://api.dhivehigpt.com/v1/voices?search=zee&per_page=10'
    );
  });

  it('prefixes every request with the configured apiVersion', async () => {
    const { fetch, calls } = createMockFetch([{ status: 200, body: { data: [] } }]);
    const http = new HttpClient({
      apiKey: 'test-key',
      baseUrl: 'https://api.dhivehigpt.com',
      apiVersion: 'v2',
      fetch,
    });

    await http.request('/voices');

    expect(calls[0]?.url).toBe('https://api.dhivehigpt.com/v2/voices');
  });

  it('trims leading and trailing slashes from a custom apiVersion', async () => {
    const { fetch, calls } = createMockFetch([{ status: 200, body: { data: [] } }]);
    const http = new HttpClient({
      apiKey: 'test-key',
      baseUrl: 'https://api.dhivehigpt.com',
      apiVersion: '/v2/',
      fetch,
    });

    await http.request('/voices');

    expect(calls[0]?.url).toBe('https://api.dhivehigpt.com/v2/voices');
  });

  it('omits the query string entirely when there are no params', async () => {
    const { http, calls } = makeClient([{ status: 200, body: { data: [] } }]);

    await http.request('/voices');

    expect(calls[0]?.url).toBe('https://api.dhivehigpt.com/v1/voices');
  });

  it('sends a JSON body and Content-Type header for requests with a body', async () => {
    const { http, calls } = makeClient([{ status: 201, body: { data: {} } }]);

    await http.request('/tts', { method: 'POST', body: { text: 'hi', voice: 'hajja' } });

    expect(calls[0]?.method).toBe('POST');
    expect(calls[0]?.headers['Content-Type']).toBe('application/json');
    expect(calls[0]?.body).toEqual({ text: 'hi', voice: 'hajja' });
  });

  it('returns undefined for 204 No Content responses', async () => {
    const { http } = makeClient([{ status: 204 }]);

    const result = await http.request('/tts/some-uuid', { method: 'DELETE' });

    expect(result).toBeUndefined();
  });

  it.each([
    [401, AuthenticationError, 'API key is required'],
    [403, InsufficientCreditsError, "You don't have any credits available."],
    [404, NotFoundError, 'Not found'],
    [422, ValidationError, 'The selected task is invalid.'],
    [429, RateLimitError, 'Too Many Attempts.'],
    [500, ServerError, 'There was an error generating the audio. Please try again.'],
  ] as const)('maps HTTP %i to %s', async (status, ErrorClass, message) => {
    const { http } = makeClient([{ status, body: { message } }]);

    await expect(http.request('/voices')).rejects.toBeInstanceOf(ErrorClass);
    const { http: http2 } = makeClient([{ status, body: { message } }]);
    await expect(http2.request('/voices')).rejects.toMatchObject({ status, message });
  });

  it('exposes field errors on ValidationError', async () => {
    const { http } = makeClient([
      {
        status: 422,
        body: {
          message: 'The selected task is invalid.',
          errors: { task: ['The selected task is invalid.'] },
        },
      },
    ]);

    await expect(http.request('/tasks/calculate')).rejects.toMatchObject({
      errors: { task: ['The selected task is invalid.'] },
    });
  });

  it('falls back to a generic message when the error body has none', async () => {
    const { http } = makeClient([{ status: 418 }]);

    await expect(http.request('/voices')).rejects.toMatchObject({
      status: 418,
      message: 'Request failed with status 418',
    });
  });

  it('passes an AbortSignal through and clears the timeout when timeoutMs is set', async () => {
    const { fetch, calls } = createMockFetch([{ status: 200, body: { data: [] } }]);
    const http = new HttpClient({
      apiKey: 'test-key',
      baseUrl: 'https://api.dhivehigpt.com',
      apiVersion: 'v1',
      fetch,
      timeoutMs: 5000,
    });

    await http.request('/voices');

    expect(calls).toHaveLength(1);
  });

  it('aborts the request once timeoutMs elapses', async () => {
    let capturedSignal: AbortSignal | undefined;
    const fetch = vi.fn((_url: string, init?: RequestInit) => {
      capturedSignal = init?.signal ?? undefined;
      return new Promise<Response>((_resolve, reject) => {
        capturedSignal?.addEventListener('abort', () => reject(new Error('aborted')));
      });
    }) as unknown as FetchLike;

    const http = new HttpClient({
      apiKey: 'test-key',
      baseUrl: 'https://api.dhivehigpt.com',
      apiVersion: 'v1',
      fetch,
      timeoutMs: 10,
    });

    await expect(http.request('/voices')).rejects.toThrow('aborted');
    expect(capturedSignal?.aborted).toBe(true);
  });
});
