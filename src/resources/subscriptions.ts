import type { HttpClient } from '../http.js';
import type { Balance } from '../types.js';

export class Subscriptions {
  constructor(private readonly http: HttpClient) {}

  /**
   * Returns the current API key team together with its active subscription
   * and active billing period. The subscription and billing period are null
   * when the team has no active subscription.
   */
  getBalance(): Promise<Balance> {
    return this.http.request<Balance>('/balance');
  }
}
