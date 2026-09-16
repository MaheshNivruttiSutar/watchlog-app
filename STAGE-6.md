# Stage 6 — Zustand + TanStack Query

**Branch:** `stage-6`  
**Goal:** Split UI-only state from server/async state. Use Zustand for UI, TanStack Query for server data.

## What you implemented

Everything from **Stage 5**, plus:

- **Zustand** (`src/store/uiStore.ts`) — list filters, search box text/type, theme
- **TanStack Query** (`src/query/`) — `queryClient`, keys, fake `watchlistApi` over `localStorage`
- **Hooks** — `usePopular`, `useTitleSearch`, `useWatchlist*` (queries + mutations)
- **Optimistic rating** — cache updates first; **Simulate server failure** rolls stars back
- **Removed** — Redux Toolkit, redux-saga, `ThemeContext`
- **Devtools** — `@tanstack/react-query-devtools` (dev only)
- **Evidence** — `docs/query-devtools-cache-lifecycle.png`
- **Tests** — `uiStore`, `watchlistApi`, `watchlistView`, `queryKeys`, `optimisticRating`

## UI vs server split

| Piece | Where it lives | Tool |
|-------|----------------|------|
| List filters, search box, theme | `uiStore` | Zustand |
| Popular, search results, watchlist | Query hooks + cache | TanStack Query |
| Login session | `AuthContext` | Keep Context |
| Delete dialog, login error | Component `useState` | Ephemeral |

Do not put watchlist or search results into Zustand.

## Architecture change

```
Before (Stage 5):  Pages → Redux slices → saga → api/
After  (Stage 6):  Pages → Query hooks / uiStore → api/ (and watchlistApi)
```

## Commands to try

```bash
npm run dev
npm test
```

## Checkpoint

```bash
git checkout stage-6
# or stay on main — same code, plus all STAGE-*.md docs
```
