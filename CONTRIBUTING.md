# Contributing

Contributions are welcome and will be fully credited.

We accept contributions via pull requests on [GitHub](https://github.com/Javaabu/dhivehigpt-sdk-typescript).

## Pull Requests

- **Add tests for any new behavior.** Your patch won't be accepted if it doesn't have tests, and coverage should stay at 100%.
- **Document any change in behavior.** Make sure the `README.md` and the files under `docs/` are kept up-to-date.
- **Create feature branches.** Don't ask us to pull from your `main` branch.
- **One pull request per feature.** If you want to do more than one thing, send multiple pull requests.
- **Keep it small.** Try to keep changes focused so they're easy to review.

## Local setup

```bash
npm install
npm run typecheck
npm test
npm run build
```

## Running tests

```bash
npm test              # run once
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

## Commit messages

Prefix a commit message with `coverage` (e.g. `coverage: bump test coverage for tts resource`) to also have CI
regenerate and commit the coverage badge for that push.

## Reporting a bug

If you've found a bug, please open an [issue](https://github.com/Javaabu/dhivehigpt-sdk-typescript/issues) with:

- A clear description of the problem.
- Steps to reproduce, ideally a minimal code sample.
- What you expected to happen, and what actually happened.

If you've found a security related issue, please email [info@javaabu.com](mailto:info@javaabu.com) instead of using the issue tracker.

**Happy coding**!
