import { describe, expect, it } from 'vitest';
import { DhivehiGPT } from '../../src/index.js';
import { createMockFetch } from '../helpers/mockFetch.js';

describe('Subscriptions resource', () => {
  it('returns the team balance', async () => {
    const balance = {
      team: {
        uuid: 'e7d5afd9-2373-47a6-a41b-764bda9015e6',
        name: 'Sample Team',
        name_dv: 'ސާމްޕަލް ޓީމް',
        used_seats: 2,
      },
      subscription: {
        plan: { slug: 'team_medium', name: 'ޓީމް ބޮޑު', duration_days: 30 },
        start_at: '2026-07-25T22:03:16+05:00',
        expire_at: '2027-07-20T22:03:16+05:00',
        duration_days: 360,
        expires_in: 28783195,
        is_annual_billing: true,
        team_seats: 10,
        unlimited_seats: false,
      },
      billing_period: {
        period_no: 1,
        credits: 5540,
        addon_credits: 0,
        total_credits: 5540,
        used_credits: 6.55,
        balance: 5533.45,
        start_at: '2026-07-25T22:03:16+05:00',
        expire_at: '2026-08-24T22:03:16+05:00',
        duration_days: 30,
        expires_in: 271195,
      },
    };
    const { fetch, calls } = createMockFetch([{ status: 200, body: balance }]);
    const client = new DhivehiGPT({ apiKey: 'test-key', fetch });

    const result = await client.subscriptions.getBalance();

    expect(calls[0]?.url).toBe('https://api.dhivehigpt.com/v1/balance');
    expect(result).toEqual(balance);
  });

  it('returns null team_seats for a plan with unlimited seats', async () => {
    const balance = {
      team: { uuid: 'e7d5afd9', name: 'Team', name_dv: 'ޓީމް', used_seats: 5 },
      subscription: {
        plan: { slug: 'team_unlimited', name: 'ޓީމް ބޮޑު', duration_days: 30 },
        start_at: '2026-07-25T22:03:16+05:00',
        expire_at: '2027-07-20T22:03:16+05:00',
        duration_days: 360,
        expires_in: 28783195,
        is_annual_billing: true,
        team_seats: null,
        unlimited_seats: true,
      },
      billing_period: null,
    };
    const { fetch } = createMockFetch([{ status: 200, body: balance }]);
    const client = new DhivehiGPT({ apiKey: 'test-key', fetch });

    const result = await client.subscriptions.getBalance();

    expect(result.subscription?.team_seats).toBeNull();
    expect(result.subscription?.unlimited_seats).toBe(true);
  });

  it('returns null subscription and billing_period when the team has none', async () => {
    const balance = {
      team: { uuid: 'e7d5afd9', name: 'Team', name_dv: 'ޓީމް', used_seats: 1 },
      subscription: null,
      billing_period: null,
    };
    const { fetch } = createMockFetch([{ status: 200, body: balance }]);
    const client = new DhivehiGPT({ apiKey: 'test-key', fetch });

    const result = await client.subscriptions.getBalance();

    expect(result.subscription).toBeNull();
    expect(result.billing_period).toBeNull();
  });
});
