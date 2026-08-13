# WatchLog — Architecture & Folder Structure

This document explains how the project is organized: two products in one repo (React app + TypeScript data library), and what each folder is for.

## Overview

WatchLog is a personal movie and book watchlist:

1. Search books (Open Library — no API key) and movies (TMDB — needs API key)
2. Add items with status (`want` / `watching` / `reading` / `done`) and rating
3. View stats on a dashboard
4. Practice protected routes with fake login (demo users in `localStorage`)

**Two builds from the same `src/`:**

| Command | Output | Purpose |
|---------|--------|---------|
| `npm run build` | `dist/` | Production React app |
| `npm run build:lib` | `lib/` | Compiled data layer for Node (tests, live scripts) |

Edit source under `src/` only. Do not hand-edit `dist/` or `lib/`.

---

## Folder tree

```
watchLogProject/
├── index.html              # HTML shell — Vite mounts React into #root
├── package.json            # Scripts and dependencies
├── vite.config.ts          # React app build / dev server
├── vitest.config.ts        # Unit test runner
├── tsconfig.json           # TypeScript for the app
├── tsconfig.lib.json       # TypeScript for the Node library build
├── .env / .env.example     # TMDB keys (`.env` is git-ignored)
├── scripts/
│   └── test-search.mjs     # Live API smoke test (real network)
├── dist/                   # Generated — production React build
├── lib/                    # Generated — compiled data layer for Node
├── docs/
│   └── ARCHITECTURE.md     # This file
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
    │   └── theme.ts
    ├── hooks/
    │   ├── useSearch.ts
    │   └── usePopular.ts
    ├── context/
    │   ├── AuthContext.tsx
    │   ├── WatchlistContext.tsx
    │   └── ThemeContext.tsx
    ├── data/
    │   └── localStorage.tsx  # Demo users + localStorage helpers
    ├── components/
    │   ├── Sidebar.tsx
    │   ├── ProtectedRoute.tsx
    │   ├── SearchBar.tsx
    │   ├── SearchResults.tsx
    │   ├── WatchlistCard.tsx
    │   ├── WatchlistGrid.tsx
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
  → main.tsx                 # setLocalStorage() seeds demo users
     → BrowserRouter
        → App.tsx
           → ThemeProvider
              → AuthProvider
                 → WatchlistProvider
                    → Sidebar + Routes (pages)
```

| Step | File | Job |
|------|------|-----|
| 1 | `main.tsx` | Find `#root`, seed users, wrap in router |
| 2 | `App.tsx` | Stack contexts, map URLs to pages |
| 3 | Pages | Screens; read/write via context and hooks |

---

## Layers (learn this order)

| Layer | Folder | Job |
|-------|--------|-----|
| Types | `src/types/` | Data shapes (`WatchlistItem`, `SearchResult`, stats) |
| Config | `src/config.ts` | API base URLs + `getTmdbApiKey()` — all env reads here |
| API | `src/api/` | Fetch Open Library / TMDB; mappers clean external JSON |
| Utils | `src/utils/` | Pure helpers: filter, sort, group, statistics (easy to test) |
| Hooks | `src/hooks/` | Async UI glue: loading, error, results, abort |
| Context | `src/context/` | Shared state: auth, watchlist, theme |
| Data | `src/data/` | Demo users in `localStorage` |
| Components | `src/components/` | Reusable UI widgets |
| Pages | `src/pages/` | One screen per route |
| Styles | `src/styles/` | Global CSS + shared UI class helpers |
| Tests | `src/__tests__/` | Unit tests (mocked APIs) + shared mock watchlist |

**Rule of thumb:** pages call hooks/context; hooks call `api/`; UI never talks to raw TMDB/Open Library field names (mappers handle that).

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

| Context | Holds |
|---------|--------|
| `AuthContext` | Current user, `login` / `logout` (fake auth) |
| `WatchlistContext` | Items + `addItem` / `updateItem` / `removeItem` |
| `ThemeContext` | Light / dark theme |

**Persistence note:** demo **users** are stored in `localStorage`. The **watchlist** starts from `mockWatchlist` and lives in React state — a full page refresh resets watchlist changes. Auth is for practice only (not production-safe).

---

## Data flow (search → add)

```
User types in SearchBar
        ↓
useSearch (loading / error / results)
        ↓
api/search.ts  →  Open Library / TMDB
        ↓
mappers.ts  →  SearchResult[]
        ↓
User clicks Add
        ↓
WatchlistContext.addItem(...)
        ↓
ListPage / Dashboard / Detail read the same items
```

---

## Library entry (`src/index.ts` → `lib/`)

`src/index.ts` re-exports types, config, utils, and API functions so Node scripts and tests can import the data layer without the React UI.

Live check: `npm run test:live` runs `build:lib`, then `scripts/test-search.mjs` against real APIs.

---

## Keeping this doc useful

Prefer updating **folder purpose** here when you add a new top-level area under `src/`. Avoid listing every new file unless it changes how layers connect.
