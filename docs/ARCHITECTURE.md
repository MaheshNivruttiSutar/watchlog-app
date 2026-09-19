# WatchLog — Architecture & Folder Structure

This document explains how the project is organized: two products in one repo (React app + TypeScript data library), and what each folder is for.

## Overview

WatchLog is a personal movie and book watchlist:

1. Search books (Open Library — no API key) and movies (TMDB — needs API key)
2. Add items with status (`want` / `watching` / `reading` / `done`) and rating
3. View stats on a dashboard
4. Practice protected routes with fake login (demo users in `localStorage`)

**Three builds from this repo:**

| Command | Output | Purpose |
|---------|--------|---------|
| `npm run build` | `dist/` | Production React app (Vite) |
| `npm run build:lib` | `lib/` | Compiled data layer for Node (tests, live scripts) |
| `npm run build:remote` / `npm run build:host` | `dist-remote/` + `host-shell/dist/` | Module Federation remote + host shell |

Edit source under `src/` (and `host-shell/src/`) only. Do not hand-edit `dist/`, `dist-remote/`, `host-shell/dist/`, or `lib/`.

---

## Folder tree

```
watchLogProject/
├── index.html              # HTML shell — Vite mounts React into #root
├── package.json            # Scripts and dependencies
├── vite.config.ts          # React app build / dev server
├── webpack/                # WatchLog Module Federation remote
├── host-shell/             # Separate Webpack host that loads the remote
├── STAGE-8.md              # Host + remote runbook and submission notes
├── vitest.config.ts        # Unit test runner
├── tsconfig.json           # TypeScript for the app
├── tsconfig.lib.json       # TypeScript for the Node library build
├── .env / .env.example     # TMDB keys (`.env` is git-ignored)
├── scripts/
│   └── test-search.mjs     # Live API smoke test (real network)
├── dist/                   # Generated — production React build
├── dist-remote/            # Generated — Webpack remote
├── lib/                    # Generated — compiled data layer for Node
├── docs/
│   ├── ARCHITECTURE.md     # This file
│   └── STAGE-8-BUNDLE-ANALYSIS.md
└── src/                    # All application source
    ├── main.tsx            # App bootstrap (seed users, mount React)
    ├── App.tsx             # Providers + routes
    ├── index.ts            # Public exports for the data library
    ├── config.ts           # Central env / API URL config
    ├── vite-env.d.ts       # Vite env typings
    ├── types/
    │   └── watchlistItem.ts
    ├── api/
    │   ├── search.ts       # Book + movie search
    │   ├── popular.ts      # Popular lists
    │   └── mappers.ts      # External API JSON → SearchResult
    ├── utils/
    │   ├── filter.ts
    │   ├── sort.ts
    │   ├── group.ts
    │   ├── statistics.ts
    │   ├── watchlistView.ts  # stats, recent, filtered list (pure)
    │   └── theme.ts
    ├── i18n/
    │   ├── en.ts             # English catalog (source of truth for keys)
    │   ├── hi.ts             # Hindi catalog
    │   ├── locale.ts         # Locale type + localStorage helpers
    │   └── index.ts          # i18next init
    ├── hooks/
    │   ├── usePopular.ts
    │   ├── useDebouncedValue.ts
    │   ├── useTitleSearch.ts
    │   └── useWatchlist.ts
    ├── query/
    │   ├── queryClient.ts    # shared Query cache
    │   ├── keys.ts           # query keys (cache slots)
    │   └── watchlistApi.ts   # localStorage as a fake server
    ├── store/
    │   └── uiStore.ts        # Zustand: filters, search box, theme
    ├── context/
    │   └── AuthContext.tsx
    ├── data/
    │   └── localStorage.tsx  # Demo users + localStorage helpers
    ├── debug/
    │   └── renderCounts.ts   # Dev-only search profile counters
    ├── components/
    │   ├── Sidebar.tsx
    │   ├── LanguageToggle.tsx
    │   ├── ProtectedRoute.tsx
    │   ├── SearchBar.tsx
    │   ├── SearchResults.tsx
    │   ├── SearchResultCard.tsx
    │   ├── SearchProfileHud.tsx  # Dev HUD when watchlog-profile=1
    │   ├── WatchlistCard.tsx   # Card / Cover / Meta / Remove (compound parts)
    │   ├── WatchlistGrid.tsx   # Grid root + empty state; attaches Card parts
    │   ├── RatingInput.tsx
    │   ├── ConfirmDeleteDialog.tsx
    │   └── ThemeToggle.tsx
    ├── pages/
    │   ├── DashboardPage.tsx
    │   ├── ListPage.tsx
    │   ├── DetailPage.tsx
    │   ├── AddEditPage.tsx
    │   ├── LoginPage.tsx
    │   └── NotFoundPage.tsx
    ├── styles/
    │   ├── App.css
    │   └── ui.ts
    └── __tests__/
        ├── mockData.ts
        ├── filter.test.ts
        ├── sort.test.ts
        ├── group.test.ts
        ├── statistics.test.ts
        ├── search.test.ts
        └── popular.test.ts
```

Ignore `node_modules/` (installed packages). Treat `dist/` and `lib/` as build outputs, not source of truth.

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
| Utils | `src/utils/` | Pure helpers: filter, sort, group, statistics (easy to test) |
| Hooks | `src/hooks/` | TanStack Query hooks: search, popular, watchlist |
| i18n | `src/i18n/` | English/Hindi catalogs + i18next; UI reads strings via `t()` |
| Query | `src/query/` | QueryClient, keys, fake watchlist API |
| Store | `src/store/` | Zustand `uiStore`: filters, search box, theme |
| Context | `src/context/` | Shared UI state: auth |
| Data | `src/data/` | Demo users in `localStorage` |
| Components | `src/components/` | Reusable UI widgets |
| Pages | `src/pages/` | One screen per route |
| Styles | `src/styles/` | Global CSS + shared UI class helpers |
| Tests | `src/__tests__/` | Unit tests (mocked APIs) + shared mock watchlist |

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

## Library entry (`src/index.ts` → `lib/`)

`src/index.ts` re-exports types, config, utils, and API functions so Node scripts and tests can import the data layer without the React UI.

Live check: `npm run test:live` runs `build:lib`, then `scripts/test-search.mjs` against real APIs.

---

## Keeping this doc useful

Prefer updating **folder purpose** here when you add a new top-level area under `src/`. Avoid listing every new file unless it changes how layers connect.
