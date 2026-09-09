# Stage 1 — TypeScript Data Layer

**Branch:** `stage-1`  
**Goal:** Build the data foundation with no UI — types, API clients, utils, and tests.

## What you implemented

- **Types** (`src/types/watchlistItem.ts`) — `WatchlistItem`, `SearchResult`, status enums, stats shapes
- **Config** (`src/config.ts`) — central env reads for Open Library and TMDB
- **API layer** (`src/api/`)
  - `search.ts` — book search (Open Library) + movie search (TMDB)
  - `popular.ts` — popular books and movies
  - `mappers.ts` — external JSON → clean `SearchResult[]`
- **Utils** (`src/utils/`) — pure helpers: `filter`, `sort`, `group`, `statistics`
- **Library entry** (`src/index.ts`) — re-exports for Node / tests
- **Tests** (`src/__tests__/`) — unit tests with mocked APIs
- **Live script** (`scripts/test-search.mjs`) — smoke test against real APIs

## What is NOT in Stage 1

- No React, Vite app shell, or routing
- No watchlist UI or persistence

## Commands to try

```bash
npm install
npm test
npm run build:lib
npm run test:live   # needs TMDB key in .env
```

## Checkpoint

```bash
git checkout stage-1
```
