# WatchLog — Architecture & Folder Structure

This document explains how the project is organized: a Vite React app, a TypeScript data library, a Webpack Module Federation remote + host, and an automated test suite.

## Overview

WatchLog is a personal movie and book watchlist:

1. Search books (Open Library — no API key) and movies (TMDB — needs API key)
2. Add items with status (`want` / `watching` / `reading` / `done`) and rating
3. View stats on a dashboard
4. Practice protected routes with fake login (demo users in `localStorage`)
5. Switch UI language (EN / HI) and light / dark theme
6. Load the same UI from a separate host via Module Federation (Stage 8)
7. Fail fast on contract breaks via Jest + RTL + MSW (Stage 9)

**Builds from this repo:**

| Command | Output | Purpose |
|---------|--------|---------|
| `npm run build` | `dist/` | Production React app (Vite) |
| `npm run build:lib` | `lib/` | Compiled data layer for Node (live scripts) |
| `npm run build:remote` / `npm run build:host` | `dist-remote/` + `host-shell/dist/` | Module Federation remote + host shell |
| `npm run test:coverage` | `coverage/` | HTML + text coverage (git-ignored) |

Edit source under `src/` (and `host-shell/src/`) only. Do not hand-edit `dist/`, `dist-remote/`, `host-shell/dist/`, `lib/`, or `coverage/`.

---

## Folder tree

```
watchLogProject/
├── index.html              # HTML shell — Vite mounts React into #root
├── package.json            # Scripts and dependencies
├── vite.config.ts          # React app build / dev server
├── jest.config.cjs         # jsdom, MSW setup, 80% coverage gates
├── babel.config.jest.cjs   # Jest-only TS/JSX transform (not Vite/Webpack)
├── webpack/                # WatchLog Module Federation remote
│   ├── remote.config.cjs
│   ├── sharedSingletons.cjs  # react / react-dom / react-router-dom
│   └── analyzer.cjs
├── host-shell/             # Independent Webpack host (port 3000)
├── STAGE-1.md … STAGE-9.md # Per-stage write-ups
├── tsconfig.json           # TypeScript for the app
├── tsconfig.lib.json       # TypeScript for the Node library build
├── .env / .env.example     # TMDB keys (`.env` is git-ignored)
├── scripts/
│   ├── test-search.mjs     # Live API smoke test (real network)
│   └── check-mf-singletons.mjs
├── dist/                   # Generated — production Vite build
├── dist-remote/            # Generated — Webpack remote
├── lib/                    # Generated — compiled data layer for Node
├── coverage/               # Generated — Jest coverage (git-ignored)
├── docs/
│   ├── ARCHITECTURE.md     # This file
│   ├── STAGE-7-PROFILING.md
│   └── STAGE-8-BUNDLE-ANALYSIS.md
└── src/                    # All application source
    ├── main.tsx            # App bootstrap (seed users, mount React)
    ├── App.tsx             # Providers + routes
    ├── index.ts            # Public exports for the data library
    ├── config.ts           # Central env / API URL config
    ├── types/
    │   └── watchlistItem.ts
    ├── api/                # search, popular, mappers
    ├── utils/              # filter, sort, group, statistics, theme, storage, view
    ├── i18n/               # en / hi catalogs + i18next
    ├── hooks/              # search, popular, watchlist, debounce
    ├── query/              # QueryClient, keys, fake watchlist API
    ├── store/              # Zustand uiStore
    ├── context/            # AuthContext
    ├── data/               # Demo users
    ├── debug/              # Dev-only search profile counters
    ├── remote/             # MF expose: WatchLogApp + standalone entry
    ├── components/         # Sidebar, search, watchlist grid, rating, …
    ├── pages/              # One screen per route
    ├── styles/
    └── __tests__/          # Jest + RTL + MSW (see Testing below)
```

Ignore `node_modules/` (installed packages). Treat `dist/`, `dist-remote/`, `host-shell/dist/`, `lib/`, and `coverage/` as generated output, not source of truth.

---

## Boot sequence

```
index.html
  → main.tsx                 # i18n init, seed users, mount React
     → BrowserRouter
        → App.tsx
           → QueryClientProvider
              → AuthProvider
                 → Sidebar + Routes (pages)
                    (theme/filters/locale: Zustand `uiStore`)
              → ReactQueryDevtools (dev only)
```

| Step | File | Job |
|------|------|-----|
| 1 | `main.tsx` | Load i18n, find `#root`, seed users, wrap in router |
| 2 | `App.tsx` | QueryClientProvider, auth context, map URLs to pages |
| 3 | Pages | Watchlist/search via TanStack Query; filters/theme/locale via Zustand |

---

## Layers (learn this order)

| Layer | Folder | Job |
|-------|--------|-----|
| Types | `src/types/` | Data shapes (`WatchlistItem`, `SearchResult`, stats) |
| Config | `src/config.ts` | API base URLs + `getTmdbApiKey()` — all env reads here |
| API | `src/api/` | Fetch Open Library / TMDB; mappers clean external JSON |
| Utils | `src/utils/` | Pure helpers: filter, sort, group, statistics, theme, watchlist storage/view |
| Hooks | `src/hooks/` | TanStack Query hooks: search, popular, watchlist; debounce |
| i18n | `src/i18n/` | English/Hindi catalogs + i18next; UI reads strings via `t()` |
| Query | `src/query/` | QueryClient, keys, fake watchlist API (`localStorage`) |
| Store | `src/store/` | Zustand `uiStore`: filters, search box, theme, locale |
| Context | `src/context/` | Shared UI state: auth |
| Data | `src/data/` | Demo users in `localStorage` |
| Remote | `src/remote/` | Module Federation `WatchLogApp` and standalone mount |
| Components | `src/components/` | Reusable UI widgets |
| Pages | `src/pages/` | One screen per route |
| Styles | `src/styles/` | Global CSS + shared UI class helpers |
| Tests | `src/__tests__/` | Unit, hook, RTL page, and journey tests |

**Rule of thumb:** pages read watchlist/search from TanStack Query; filters/theme from Zustand; UI never talks to raw TMDB/Open Library field names (mappers handle that).

---

## Routes

| Path | Page | Auth |
|------|------|------|
| `/` | Dashboard | Public |
| `/watchlist` | List + filters | Public |
| `/items/:id` | Item detail | Public |
| `/add` | Search / add | Protected (`ProtectedRoute`) |
| `/login` | Login | Public |
| `*` | Not found | Public |

---

## Shared state

| Source | Holds |
|--------|--------|
| TanStack Query `watchlist` | Items via `watchlistApi` (`localStorage`) |
| TanStack Query `search` / `popular` | Cached API results |
| Zustand `uiStore` | List filters, search box, light / dark theme, UI locale |
| `AuthContext` | Current user, `login` / `logout` (fake auth) |

**Persistence note:** demo **users** and the **watchlist** are stored in `localStorage`. Query loads the list through `fetchWatchlist()` (falls back to `mockWatchlist`). Rating updates are optimistic: the cache changes first, then reverts if the fake API throws. Auth is for practice only (not production-safe).

---

## Data flow (search → add)

```
User types in SearchBar (urgent Zustand update)
        ↓
useDebouncedValue waits for 300 ms of quiet
        ↓
useTitleSearch → queryKey ['search', type, query]
        ↓
api/search.ts  →  Open Library / TMDB
        ↓
cached SearchResult[]
        ↓
useDeferredValue lets React schedule the result-list render
        ↓
memoized SearchResultCard skips unchanged cards
        ↓
User clicks Add
        ↓
useAddWatchlistItem → watchlistApi → localStorage
        ↓
ListPage / Dashboard / Detail read queryKeys.watchlist
```

---

## Module Federation (Stage 8)

Vite still owns `npm run dev` / `npm run build`. Webpack owns the remote:

- Remote (`npm run dev:remote`, port 3001) exposes `watchlog/./WatchLogApp`
- Host (`host-shell/`, port 3000) loads `remoteEntry.js` at runtime
- Shared singletons: `webpack/sharedSingletons.cjs` (React, React DOM, react-router-dom)

Write-up: [STAGE-8.md](../STAGE-8.md). Bundle proof: [STAGE-8-BUNDLE-ANALYSIS.md](STAGE-8-BUNDLE-ANALYSIS.md).

---

## Testing (Stage 9)

Jest runs the suite (`npm test`). React Testing Library queries the UI. MSW intercepts Open Library / TMDB `fetch`. Watchlist mutations are **not** HTTP — they use `watchlistApi` + `localStorage`. Tests that need an empty list must `saveWatchlist([])` or they get the seed `mockWatchlist`.

Vite remains the app bundler. Jest 29 compiles tests through `babel.config.jest.cjs` because the repo is `"type": "module"`.

Each React test gets a fresh `QueryClient` with retries off (`renderWithProviders.tsx`). Production `queryClient` has 30s `staleTime` and must not be shared across tests except the journey, which clears it in `beforeEach`.

| Layer | Examples |
|-------|----------|
| Unit | `filter`, `sort`, `group`, `statistics`, `theme`, `watchlistStorage` |
| Hook | `useTitleSearch` loading / success / error via MSW |
| Page | `listPage` render, filter, empty; dashboard; detail rollback |
| Journey | `userJourney`: login → search Dune → add → Done → rate 4 |

Coverage: `npm run test:coverage` (V8, 80% statements/branches/functions/lines). Write-up: [STAGE-9.md](../STAGE-9.md).

---

## Library entry (`src/index.ts` → `lib/`)

`src/index.ts` re-exports types, config, utils, and API functions so Node scripts and tests can import the data layer without the React UI.

Live check: `npm run test:live` runs `build:lib`, then `scripts/test-search.mjs` against real APIs.

---

## Keeping this doc useful

Prefer updating **folder purpose** here when you add a new top-level area under `src/`. Avoid listing every new file unless it changes how layers connect.
