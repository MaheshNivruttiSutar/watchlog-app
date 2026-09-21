# WatchLog — Stage 9

Stage 9 adds an automated safety net. The app still behaves like Stage 8.
The change is confidence: utilities, the search hook, the list page, and one
complete user journey fail fast when their contracts break.

## Tools

| Tool | Job in this repo |
|------|------------------|
| Jest 29 | Discovers tests, assertions, coverage (`npm test`) |
| babel-jest | Compiles TypeScript/JSX to CommonJS for the runner |
| jsdom | Browser-like DOM |
| React Testing Library | Query the accessible UI a user would see |
| user-event | Clicks and typing |
| MSW 2 | Intercepts Fetch for Open Library / TMDB |

The course names Jest. Vite still builds the app (`npm run dev` / `npm run build`).
Jest only replaced the test runner. `main` keeps Vitest; this `stage-9-jest`
branch is the Jest-shaped suite if that is what review asks for.

MSW is only for HTTP. Watchlist create/update/rate still go through
`localStorage`. Empty-list tests must call `saveWatchlist([])` or the API
falls back to the seeded mock list.

Jest 29 does not execute native ESM the way Vitest does. Tests are compiled
with a Jest-only Babel config (`babel.config.jest.cjs`) so `"type": "module"`
does not block the runner. Webpack still uses ts-loader. Vite still uses
esbuild.

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

## Layout

- `jest.config.cjs` — jsdom, setup files, coverage include/exclude, thresholds
- `jest.jsdom.cjs` — copies Node Fetch APIs onto jsdom (MSW 2 needs them)
- `babel.config.jest.cjs` — Jest-only transform (not used by Vite or Webpack)
- `src/__tests__/setup.ts` — MSW listen/reset, store reset, localStorage
- `src/__tests__/mswServer.ts` — default handlers; unhandled requests error
- `src/__tests__/renderWithProviders.tsx` — isolated `QueryClient` per test
