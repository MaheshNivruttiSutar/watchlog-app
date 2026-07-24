# WatchLog — Personal Movie & Book Watchlist

TypeScript data layer (Stage 1) + React UI (Stage 2).

## Setup

```bash
npm install
cp .env.example .env   # optional — needed for movie search
```

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the React app (Vite dev server) |
| `npm test` | Run unit tests (mocked APIs, fast, offline) |
| `npm run build` | Compile TypeScript library to `dist/` |
| `npm run build:app` | Build the React app for production |
| `npm run test:live` | **Live API smoke test** — hits real Open Library + TMDB |

## Environment variables

Book search works without any setup. For movies:

1. Get a free API key from [TMDB](https://www.themoviedb.org/settings/api)
   - Sign up → Settings → API → Request API Key → choose **Developer**
2. Copy `.env.example` to `.env` and set both keys (same value):

```env
TMDB_API_KEY=your_key_here
VITE_TMDB_API_KEY=your_key_here
```

- `TMDB_API_KEY` — used by Node (unit tests, live test script)
- `VITE_TMDB_API_KEY` — used by the browser (React app via Vite)

> `.env` is git-ignored. Use `.env.example` as a template.

## Live API test (local)

Tests real book + movie APIs over the internet (not mocked). Useful to verify your TMDB key and network.

```bash
npm run test:live
```

This runs `npm run build` then `node scripts/test-search.mjs`.

**What it checks:**

- Book search (Open Library) — e.g. "hobbit"
- Movie search (TMDB) — e.g. "inception"
- Popular movies + books

**Expected output:**

```
WatchLog — Live API Test
========================
TMDB key configured: yes

✅ Book search (Open Library) — 10 result(s)
✅ Movie search (TMDB) — 20 result(s)
✅ Popular movies (TMDB) — ...
✅ Popular books (Open Library) — ...

Done.
```

If movie tests fail with a network/timeout error, books may still pass — check DNS/VPN or try again later.

Script location: `scripts/test-search.mjs`

## Run the React app

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Project structure

| Area | Purpose |
|------|---------|
| `src/types/` | Data shapes for movies, books, status, ratings |
| `src/utils/` | Filter, sort, group, statistics |
| `src/api/` | Search (Open Library + TMDB), popular content |
| `src/components/` | React UI — cards, grid, search, detail panel |
| `src/context/` | Shared watchlist state |
| `src/hooks/` | `useSearch` — loading, error, results, abort |

## Stage 1 library usage

After `npm run build`, import from `dist/` in Node:

```typescript
import {
  filterByStatus,
  calculateStatistics,
  searchBooks,
  getPopularContent,
  type WatchlistItem,
} from './dist/index.js';

const { movies, books } = await getPopularContent(10);
console.log(movies, books);
```
