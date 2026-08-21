---
title: Subscriptions
sidebar_position: 3
---

# Subscriptions

View the subscription and credit balance associated with the current API key's team. Corresponds to the
`/v1/balance` API endpoint.

## Get balance

Returns the current API key team together with its active subscription and active billing period. The
`subscription` and `billing_period` fields are `null` when the team has no active subscription.

```typescript
const balance = await client.subscriptions.getBalance();

console.log(balance.billing_period?.balance); // remaining credits this billing period
```

### Returns

```typescript
interface Balance {
  team: {
    uuid: string;
    name: string;
    name_dv: string;
    used_seats: number;
  };
  subscription: {
    plan: { slug: string; name: string; duration_days: number };
    start_at: string;
    expire_at: string;
    duration_days: number;
    expires_in: number;
    is_annual_billing: boolean;
    team_seats: number | null; // null when the plan has unlimited seats
    unlimited_seats: boolean;
  } | null;
  billing_period: {
    period_no: number;
    credits: number;
    addon_credits: number;
    total_credits: number;
    used_credits: number;
    balance: number;
    start_at: string;
    expire_at: string;
    duration_days: number;
    expires_in: number;
  } | null;
}
```
