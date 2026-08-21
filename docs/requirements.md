---
title: Requirements
sidebar_position: 1.1
---

# Requirements

- Node.js 18 or later (for the built-in global `fetch`), or any other JavaScript runtime that provides a global `fetch`
  (Deno, Bun, Cloudflare Workers, browsers, etc.).
- A DhivehiGPT **team account with an active subscription**.
- An API key, generated from the [**API Keys**](https://dhivehigpt.com/team/api-keys) page of your team account.
  Only **team owners and admins** can generate API keys.

If you're running on an older Node.js version, or in an environment without a global `fetch`, you can inject
your own implementation via the [`fetch` client option](./configuration.md).
