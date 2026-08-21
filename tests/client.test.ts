import { afterEach, describe, expect, it, vi } from 'vitest';
import { DhivehiGPT, DEFAULT_BASE_URL, DEFAULT_API_VERSION, API_KEY_ENV_VAR } from '../src/index.js';
import { createMockFetch } from './helpers/mockFetch.js';

describe('DhivehiGPT client', () => {
  afterEach(() => {
    delete process.env[API_KEY_ENV_VAR];
  });

  it('throws when apiKey is missing and no env var is set', () => {
    expect(() => new DhivehiGPT({ apiKey: '' })).toThrow(/apiKey/);
    expect(() => new DhivehiGPT()).toThrow(new RegExp(API_KEY_ENV_VAR));
  });

  it('falls back to the DHIVEHIGPT_API_KEY environment variable when apiKey is omitted', async () => {
    process.env[API_KEY_ENV_VAR] = 'env-key';
    const { fetch, calls } = createMockFetch([{ status: 200, body: { data: [] } }]);
    const client = new DhivehiGPT({ fetch });

    await client.voices.list();

    expect(calls[0]?.headers['X-Api-Key']).toBe('env-key');
  });

  it('prefers an explicit apiKey over the environment variable', async () => {
    process.env[API_KEY_ENV_VAR] = 'env-key';
    const { fetch, calls } = createMockFetch([{ status: 200, body: { data: [] } }]);
    const client = new DhivehiGPT({ apiKey: 'explicit-key', fetch });

    await client.voices.list();

    expect(calls[0]?.headers['X-Api-Key']).toBe('explicit-key');
  });

  it('treats a missing process.env as no environment variable available', () => {
    const originalEnv = process.env;
    // @ts-expect-error -- deliberately simulating a runtime with no process.env
    delete process.env;

    try {
      expect(() => new DhivehiGPT()).toThrow(/apiKey/);
    } finally {
      process.env = originalEnv;
    }
  });

  it('treats a missing global process as no environment variable available', () => {
    vi.stubGlobal('process', undefined);

    try {
      expect(() => new DhivehiGPT()).toThrow(/apiKey/);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('uses the default base URL', async () => {
    const { fetch, calls } = createMockFetch([{ status: 200, body: { data: [] } }]);
    const client = new DhivehiGPT({ apiKey: 'test-key', fetch });

    await client.voices.list();

    expect(calls[0]?.url.startsWith(DEFAULT_BASE_URL)).toBe(true);
  });

  it('sends the X-Api-Key header on every request', async () => {
    const { fetch, calls } = createMockFetch([{ status: 200, body: { data: [] } }]);
    const client = new DhivehiGPT({ apiKey: 'my-secret-key', fetch });

    await client.voices.list();

    expect(calls[0]?.headers['X-Api-Key']).toBe('my-secret-key');
  });

  it('defaults to the v1 API version', async () => {
    expect(DEFAULT_API_VERSION).toBe('v1');

    const { fetch, calls } = createMockFetch([{ status: 200, body: { data: [] } }]);
    const client = new DhivehiGPT({ apiKey: 'test-key', fetch });

    await client.voices.list();

    expect(calls[0]?.url).toBe(`${DEFAULT_BASE_URL}/v1/voices`);
  });

  it('allows overriding the API version', async () => {
    const { fetch, calls } = createMockFetch([{ status: 200, body: { data: [] } }]);
    const client = new DhivehiGPT({ apiKey: 'test-key', apiVersion: 'v2', fetch });

    await client.voices.list();

    expect(calls[0]?.url).toBe(`${DEFAULT_BASE_URL}/v2/voices`);
  });

  it('allows overriding the base URL', async () => {
    const { fetch, calls } = createMockFetch([{ status: 200, body: { data: [] } }]);
    const client = new DhivehiGPT({
      apiKey: 'test-key',
      baseUrl: 'https://staging.example.com',
      fetch,
    });

    await client.voices.list();

    expect(calls[0]?.url.startsWith('https://staging.example.com')).toBe(true);
  });

  it('merges custom headers into every request', async () => {
    const { fetch, calls } = createMockFetch([{ status: 200, body: { data: [] } }]);
    const client = new DhivehiGPT({
      apiKey: 'test-key',
      headers: { 'X-Custom-Header': 'abc' },
      fetch,
    });

    await client.voices.list();

    expect(calls[0]?.headers['X-Custom-Header']).toBe('abc');
  });

  it('throws when no global fetch is available and none is provided', () => {
    const originalFetch = globalThis.fetch;
    // @ts-expect-error -- deliberately simulating an environment without fetch
    delete globalThis.fetch;

    try {
      expect(() => new DhivehiGPT({ apiKey: 'test-key' })).toThrow(/fetch/);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('exposes all resource namespaces', () => {
    const client = new DhivehiGPT({ apiKey: 'test-key', fetch: createMockFetch([]).fetch });

    expect(client.voices).toBeDefined();
    expect(client.tts).toBeDefined();
    expect(client.subscriptions).toBeDefined();
    expect(client.tasks).toBeDefined();
  });
});
