import { errorFromResponse, type ApiErrorBody } from './errors.js';

export type FetchLike = typeof fetch;

export type QueryValue = string | number | boolean | undefined | null;
export type QueryParams = Record<string, QueryValue>;

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Accepts any plain object of query parameters; non-primitive values are stringified. */
  query?: object;
  body?: unknown;
}

export interface HttpClientConfig {
  apiKey: string;
  baseUrl: string;
  /** API version path segment prepended to every request, e.g. "v1". */
  apiVersion: string;
  fetch: FetchLike;
  timeoutMs?: number;
  headers?: Record<string, string>;
}

function buildQueryString(query: object | undefined): string {
  if (!query) {
    return '';
  }

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query as QueryParams)) {
    if (value === undefined || value === null) {
      continue;
    }
    params.set(key, String(value));
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

export class HttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly apiVersion: string;
  private readonly fetchImpl: FetchLike;
  private readonly timeoutMs: number | undefined;
  private readonly extraHeaders: Record<string, string>;

  constructor(config: HttpClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.apiVersion = config.apiVersion.replace(/^\/+|\/+$/g, '');
    this.fetchImpl = config.fetch;
    this.timeoutMs = config.timeoutMs;
    this.extraHeaders = config.headers ?? {};
  }

  /**
   * Sends a request to `{baseUrl}/{apiVersion}{path}`. `path` should start
   * with a leading slash and must not include the API version segment.
   */
  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', query, body } = options;
    const url = `${this.baseUrl}/${this.apiVersion}${path}${buildQueryString(query)}`;

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'X-Api-Key': this.apiKey,
      ...this.extraHeaders,
    };

    let requestBody: string | undefined;
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
      requestBody = JSON.stringify(body);
    }

    const controller = this.timeoutMs !== undefined ? new AbortController() : undefined;
    const timeout =
      controller && this.timeoutMs !== undefined
        ? setTimeout(() => controller.abort(), this.timeoutMs)
        : undefined;

    let response: Response;
    try {
      response = await this.fetchImpl(url, {
        method,
        headers,
        body: requestBody,
        signal: controller?.signal,
      });
    } finally {
      if (timeout !== undefined) {
        clearTimeout(timeout);
      }
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    const data = text.length > 0 ? (JSON.parse(text) as unknown) : undefined;

    if (!response.ok) {
      throw errorFromResponse(response.status, data as ApiErrorBody | undefined);
    }

    return data as T;
  }
}
