# WatchLog — Stage 9

Stage 9 adds an automated safety net. The app still behaves like Stage 8.
The change is confidence: utilities, the search hook, the list page, and one
complete user journey fail fast when their contracts break.

## Tools

| Tool | Job in this repo |
|------|------------------|
| Vitest | Discovers tests, assertions, coverage (`npm test`) |
| jsdom | Browser-like DOM |
| React Testing Library | Query the accessible UI a user would see |
| user-event | Clicks and typing |
| MSW 2 | Intercepts Fetch for Open Library / TMDB |

The course names Jest. This project already ran Vitest with Vite. The suite
uses Jest-compatible `describe` / `it` / `expect`. RTL and MSW are the same
tools the Jest submissions use.

MSW is only for HTTP. Watchlist create/update/rate still go through
`localStorage`. Empty-list tests must call `saveWatchlist([])` or the API
falls back to the seeded mock list.

## Pyramid

**Unit** — Stage 1 helpers with `src/__tests__/mockData.ts`: filter, sort,
group, statistics, watchlist view/storage, theme.

**Hooks** — `useTitleSearch.test.tsx`: loading (delayed MSW), success (mapped
Dune), API error (HTTP 500). Query retries are off in the test client.

**RTL integration** — `listPage.test.tsx`: items render, type/status chips
filter, empty state when storage is `[]`.

**Journey** — `userJourney.test.tsx` mounts the real `App`:

1. Log in (Search is behind `ProtectedRoute`)
2. Search Open Library for Dune (MSW)
3. Add to watchlist
4. Open the item
5. Set status to Done
6. Rate 4 stars and wait for persist

## Commands

```bash
npm test
npm run test:coverage
npm run type-check
```

`npm run test:coverage` writes `coverage/` (git-ignored) and exits non-zero if
any of statements, branches, functions, or lines drop below 80%.

Measured result when Stage 9 landed:

- Statements / lines: 96.12%
- Branches: 84.56%
- Functions: 92.53%

## Layout

- `vitest.config.ts` — jsdom, setup files, coverage include/exclude, thresholds
- `src/__tests__/setup.ts` — MSW listen/reset, store reset, localStorage
- `src/__tests__/mswServer.ts` — default handlers; unhandled requests error
- `src/__tests__/renderWithProviders.tsx` — isolated `QueryClient` per test
