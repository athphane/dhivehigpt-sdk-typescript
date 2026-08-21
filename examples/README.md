# Examples

Runnable examples showing common uses of the `@javaabu/dhivehigpt-sdk` SDK.

Set your API key first:

```bash
export DHIVEHIGPT_API_KEY=your-api-key-here
```

## TypeScript examples

Run directly with Node.js's built-in TypeScript stripping (Node 22.6+), or with `tsx`/`ts-node`:

```bash
node examples/list-voices.ts
node examples/generate-tts.ts
node examples/get-balance.ts
node examples/calculate-task-cost.ts
node examples/error-handling.ts

# or, on older Node versions:
npx tsx examples/list-voices.ts
```

## CommonJS (JavaScript) example

```bash
node examples/commonjs-usage.cjs
```

Each example imports from `@javaabu/dhivehigpt-sdk`. When running the examples from within this repository
before the package is published, build the SDK first so `node_modules`/local resolution picks up the
compiled output:

```bash
npm run build
```
