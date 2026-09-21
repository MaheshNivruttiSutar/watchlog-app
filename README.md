# WatchLog — Personal Movie & Book Watchlist

React multi-page app (Vite) with a TypeScript data layer, routing, fake auth, and theme support.

Track movies and books: search Open Library / TMDB, add them to a watchlist, update status and rating, and see progress on a dashboard.

## Features

- **Dashboard** (`/`) — stats, completion rate, recently added items
- **Search** (`/add`) — popular titles + search; **login required**
- **Watchlist** (`/watchlist`) — filter by type and status
- **Item detail** (`/items/:id`) — status, rating, remove
- **Login** (`/login`) — demo users seeded into `localStorage`
- **Theme toggle** — light / dark via sidebar
- **404 page** — unknown routes

## Setup

```bash
npm install
cp .env.example .env   # optional — needed for movie search
```

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the React app (Vite) |
| `npm run dev:remote` | Start WatchLog as a Module Federation remote on port 3001 |
| `npm run dev:host` | Start the host shell on port 3000 (requires the remote) |
| `npm run build` | Build the React app for production (`dist/`) |
| `npm run build:remote` | Build the Module Federation remote (`dist-remote/`) |
| `npm run build:host` | Build the host shell (`host-shell/dist/`) |
| `npm run analyze:mf` | Analyzer reports for host + remote, then singleton check |
| `npm run build:lib` | Compile the data layer for Node (`lib/`) |
| `npm run preview` | Preview the production app build |
| `npm run type-check` | Typecheck with TypeScript (`tsc --noEmit`) |
| `npm test` | Unit tests (mocked APIs, offline) |
| `npm run test:watch` | Jest in watch mode |
| `npm run test:coverage` | Run the suite and enforce 80% coverage thresholds |
| `npm run test:live` | Live API smoke test (builds `lib/`, then hits Open Library + TMDB) |

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
> `VITE_*` vars are bundled for the browser — TMDB keys are meant for client use with rate limits; do not treat them as server-only secrets.

## Demo login

On startup, demo users are written to `localStorage`. Use any of these on `/login`:

| Email | Password |
|-------|----------|
| `arjunsharma@demo.com` | `123` |
| `snehapatel@demo.com` | `123` |
| `ravikumar@demo.com` | `123` |
| `priyasingh@demo.com` | `123` |
| `karanmehta@demo.com` | `123` |

This is **fake auth for practice** (in-memory session, passwords in client storage). It is not secure and is not for production.

After login, you are sent to `/add` (Search). Visiting Search while logged out redirects to `/login`.

## Run the React app

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Run as a Module Federation remote

```bash
npm run dev:remote
```

Open `http://localhost:3001` to run WatchLog by itself. The federation
container is available at `http://localhost:3001/remoteEntry.js` and exposes
`./WatchLogApp` from the remote named `watchlog`.

To load that remote from the independent host shell:

```bash
cd host-shell
npm install
npm run dev
```

Or from the repo root: `npm run dev:host` (after `npm install` in `host-shell`).
Open `http://localhost:3000`. Keep the remote running on port 3001.

Both Webpack configs share React, React DOM, and `react-router-dom` as
singletons (`webpack/sharedSingletons.cjs`) so the host and remote do not
mount two copies of React.

Bundle analysis (item 5): `npm run analyze:mf`. Findings:
[docs/STAGE-8-BUNDLE-ANALYSIS.md](docs/STAGE-8-BUNDLE-ANALYSIS.md).

### Routes

| Path | Page | Auth |
|------|------|------|
| `/` | Dashboard | Public |
| `/watchlist` | Watchlist list + filters | Public |
| `/items/:id` | Item detail | Public |
| `/add` | Search / add | Protected |
| `/login` | Login | Public |
| `*` | Not found | Public |

## Live API test (local)

Hits real book + movie APIs (not mocked). Useful to verify your TMDB key and network.

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

## Automated testing

Stage 9 write-up: **[STAGE-9.md](STAGE-9.md)**. On this branch the runner is Jest; Vite still builds the app.

```bash
npm test
npm run test:coverage
```

## Project structure

Quick map:

| Area | Purpose |
|------|---------|
| `src/pages/` | Route screens |
| `src/components/` | Reusable UI |
| `src/context/` | Auth, watchlist, theme |
| `src/api/` + `src/hooks/` | External search / popular APIs |
| `src/types/` + `src/utils/` | Data shapes and pure helpers |
| `src/config.ts` | Central env / API config |

Full folder tree, boot sequence, layers, and data flow: **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.
