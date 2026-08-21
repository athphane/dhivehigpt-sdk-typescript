import { HttpClient, type FetchLike } from './http.js';
import { Voices } from './resources/voices.js';
import { TTS } from './resources/tts.js';
import { Subscriptions } from './resources/subscriptions.js';
import { Tasks } from './resources/tasks.js';

export const DEFAULT_BASE_URL = 'https://api.dhivehigpt.com';
export const DEFAULT_API_VERSION = 'v1';
export const API_KEY_ENV_VAR = 'DHIVEHIGPT_API_KEY';

/** Reads the API key from `process.env.DHIVEHIGPT_API_KEY`, if available. */
function getApiKeyFromEnv(): string | undefined {
  if (typeof process === 'undefined' || !process.env) {
    return undefined;
  }
  return process.env[API_KEY_ENV_VAR] || undefined;
}

export interface DhivehiGPTOptions {
  /**
   * Your DhivehiGPT API key. Generate one from the API Keys page:
   * https://dhivehigpt.com/team/api-keys — this requires a team account with
   * an active subscription, and only team owners and admins can generate
   * API keys. Defaults to the `DHIVEHIGPT_API_KEY` environment variable when omitted.
   */
  apiKey?: string;
  /** Override the API base URL. Defaults to https://api.dhivehigpt.com. */
  baseUrl?: string;
  /** Override the API version path segment. Defaults to "v1". */
  apiVersion?: string;
  /**
   * Custom fetch implementation. Defaults to the global `fetch`. Useful for
   * environments without a global fetch, or for injecting a mock in tests.
   */
  fetch?: FetchLike;
  /** Request timeout in milliseconds. Disabled (no timeout) by default. */
  timeoutMs?: number;
  /** Additional headers to send with every request. */
  headers?: Record<string, string>;
}

/**
 * Client for the DhivehiGPT API.
 *
 * @example
 * ```ts
 * import { DhivehiGPT } from '@javaabu/dhivehigpt-sdk';
 *
 * const client = new DhivehiGPT({ apiKey: process.env.DHIVEHIGPT_API_KEY! });
 * const { data: voices } = await client.voices.list();
 * ```
 */
export class DhivehiGPT {
  readonly voices: Voices;
  readonly tts: TTS;
  readonly subscriptions: Subscriptions;
  readonly tasks: Tasks;

  constructor(options: DhivehiGPTOptions = {}) {
    const apiKey = options.apiKey ?? getApiKeyFromEnv();
    if (!apiKey) {
      throw new Error(
        'DhivehiGPT: `apiKey` is required. Pass it explicitly, or set the ' +
          `${API_KEY_ENV_VAR} environment variable.`
      );
    }

    const fetchImpl = options.fetch ?? globalThis.fetch;
    if (!fetchImpl) {
      throw new Error(
        'DhivehiGPT: no global `fetch` is available in this environment. ' +
          'Pass a `fetch` implementation via the client options.'
      );
    }

    const http = new HttpClient({
      apiKey,
      baseUrl: options.baseUrl ?? DEFAULT_BASE_URL,
      apiVersion: options.apiVersion ?? DEFAULT_API_VERSION,
      fetch: fetchImpl.bind(globalThis),
      timeoutMs: options.timeoutMs,
      headers: options.headers,
    });

    this.voices = new Voices(http);
    this.tts = new TTS(http);
    this.subscriptions = new Subscriptions(http);
    this.tasks = new Tasks(http);
  }
}
