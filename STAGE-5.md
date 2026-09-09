# Stage 5 — Redux + Saga State Management

**Branch:** `stage-5`  
**Goal:** Move async search and watchlist state from Context/hooks into Redux Toolkit + Saga.

## What you implemented

Everything from **Stage 4**, plus:

- **Redux store** (`src/store/`)
  - `watchlistSlice` — add, remove, update status, set rating
  - `watchlistSelectors` — stats, recent items, filtered list
  - `searchSlice` — query, results, loading, error
  - `searchSaga` — `takeLatest` + retry for transient API errors
  - `rootSaga`, `hooks.ts` (typed `useAppDispatch` / `useAppSelector`)
- **Removed** — `WatchlistContext`, `useSearch` hook
- **Updated pages** — Dashboard, List, Detail, AddEdit dispatch/select from store
- **Search API** — `isTransientSearchError()` helper for saga retry logic
- **Tests**
  - `watchlistSlice.test.ts`, `watchlistSelectors.test.ts`
  - `searchSlice.test.ts`, `searchSaga.test.ts`
  - extra cases in `search.test.ts`

## Architecture change

```
Before (Stage 4):  Pages → Context / useSearch → api/
After  (Stage 5):  Pages → Redux slices → saga → api/
```

## Commands to try

```bash
npm run dev
npm test
```

## Checkpoint

```bash
git checkout stage-5
# or stay on main — same code, plus all STAGE-*.md docs
```
