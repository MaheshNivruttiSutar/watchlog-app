# WatchLog — Stage 1: TypeScript Foundation

Personal Movie & Book Watchlist. Stage 1 is a **pure TypeScript module** — no UI yet.

## What's in this stage

| File | Purpose |
|------|---------|
| `src/types/watchlistItem.ts` | Data shapes for movies, books, status, ratings |
| `src/utils/filter.ts` | Filter by status, type, or genre |
| `src/utils/sort.ts` | Sort by rating or date added |
| `src/utils/group.ts` | Group items by genre |
| `src/utils/statistics.ts` | Totals, completion rate, average rating |
| `src/api/search.ts` | Search books (Open Library) and movies (TMDB) |
| `src/api/popular.ts` | Popular movies + trending books for homepage load |
| `src/config.ts` | API keys and URLs in one place |

## Setup

```bash
npm install
npm test
npm run build
```

## Movie search (optional)

Book search works without any setup. For movies:

1. Get a free API key from [TMDB](https://www.themoviedb.org/settings/api)
   - Sign up → Settings → API → Request API Key → choose **Developer**
2. Open the `.env` file in the project root
3. Paste your key after `TMDB_API_KEY=`:

```
TMDB_API_KEY=abc123your_real_key_here
```

> `.env` is git-ignored — your key stays on your machine only.
> Use `.env.example` as a template if you need to recreate it.

## Try it yourself

After `npm run build`, you can import utilities in Node or future React stages:

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

## Next stage

Stage 2 will add a React UI on top of this foundation.
