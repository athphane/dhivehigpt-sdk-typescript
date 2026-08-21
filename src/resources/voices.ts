import type { HttpClient } from '../http.js';
import type { DataResponse, ListVoicesParams, PaginatedResponse, Voice } from '../types.js';

export class Voices {
  constructor(private readonly http: HttpClient) {}

  /**
   * Returns a paginated list of available voices. Results can be filtered by
   * age group, gender, premium status, or a search term, and sorted.
   */
  list(params: ListVoicesParams = {}): Promise<PaginatedResponse<Voice>> {
    return this.http.request<PaginatedResponse<Voice>>('/voices', { query: params });
  }

  /**
   * Returns a single available voice identified by its slug, including its
   * sample audio and pricing details.
   */
  async get(slug: string): Promise<Voice> {
    const response = await this.http.request<DataResponse<Voice>>(
      `/voices/${encodeURIComponent(slug)}`
    );
    return response.data;
  }
}
