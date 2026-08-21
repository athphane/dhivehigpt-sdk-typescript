import { vi } from 'vitest';
import type { FetchLike } from '../../src/http.js';

export interface MockCall {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
}

export interface MockResponseSpec {
  status: number;
  body?: unknown;
}

/**
 * Creates a mock `fetch` implementation that returns queued responses in
 * order, and records every call made to it for assertions.
 */
export function createMockFetch(responses: MockResponseSpec[]) {
  const calls: MockCall[] = [];
  const queue = [...responses];

  const fetchMock = vi.fn(async (input: string | URL, init?: RequestInit) => {
    const spec = queue.shift();
    if (!spec) {
      throw new Error('No more mock responses queued');
    }

    const headers: Record<string, string> = {};
    if (init?.headers) {
      for (const [key, value] of Object.entries(init.headers as Record<string, string>)) {
        headers[key] = value;
      }
    }

    calls.push({
      url: String(input),
      method: init?.method ?? 'GET',
      headers,
      body: init?.body ? JSON.parse(init.body as string) : undefined,
    });

    const isNullBodyStatus = spec.status === 204 || spec.status === 304;
    const text = spec.body === undefined ? '' : JSON.stringify(spec.body);

    return new Response(isNullBodyStatus ? null : text, {
      status: spec.status,
      headers: isNullBodyStatus ? undefined : { 'Content-Type': 'application/json' },
    });
  });

  return { fetch: fetchMock as unknown as FetchLike, calls };
}
