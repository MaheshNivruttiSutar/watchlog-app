# Stage 2 — React UI Shell

**Branch:** `stage-2`  
**Goal:** Add a Vite + React front end on top of the Stage 1 data layer.

## What you implemented

Everything from **Stage 1**, plus:

- **Vite app** — `index.html`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx`
- **Watchlist state** — `WatchlistContext` (React Context + `useReducer`-style actions)
- **Search hook** — `useSearch.ts` (loading, error, abort, debounce)
- **Components**
  - `SearchBar`, `SearchResults`
  - `WatchlistCard`, `WatchlistGrid`
  - `DetailPanel` (inline detail view)
  - `ThemeToggle`
- **Theme** — `ThemeContext` + `utils/theme.ts` + `styles/App.css`

## What is NOT in Stage 2

- No React Router (single-page layout)
- No login / protected routes
- No separate Dashboard / List / Detail pages

## Commands to try

```bash
npm install
npm run dev
npm test
```

## Checkpoint

```bash
git checkout stage-2
```
