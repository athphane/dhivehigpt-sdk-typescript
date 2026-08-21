# Changelog

All notable changes to `@javaabu/dhivehigpt-sdk` will be documented in this file.

## [1.0.0] - 2026-08-21

### Added

- Initial public release of the DhivehiGPT TypeScript SDK.
- `voices`, `tts`, `subscriptions`, and `tasks` resources covering the full DhivehiGPT API.
- `client.tts.generate()` to convert text to speech (`client.tts.create()` is kept as a deprecated alias).
- Typed errors for every documented API error response (`AuthenticationError`, `InsufficientCreditsError`,
  `NotFoundError`, `ValidationError`, `RateLimitError`, `ServerError`).
- Configurable `apiVersion` client option (defaults to `v1`).
- Automatic `apiKey` resolution from the `DHIVEHIGPT_API_KEY` environment variable.
- Zero runtime dependencies; dual ESM/CommonJS build with full TypeScript types.
- Full test suite with 100% coverage, and a CI workflow that runs tests on every push and generates a
  coverage badge on commits prefixed with `coverage`.
