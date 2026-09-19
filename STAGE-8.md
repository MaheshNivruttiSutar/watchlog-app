# Stage 8 — Webpack 5 + Module Federation

**Goal:** Package WatchLog as a remote that a separate host shell loads at
runtime, share React/router as singletons, and prove they are not duplicated.

## Submission (grader)

This is a **host + remote** setup that runs locally.

1. From the repo root: `npm install`
2. From `host-shell/`: `npm install`
3. Terminal A: `npm run dev:remote` → http://localhost:3001
4. Terminal B: `npm run dev:host` → http://localhost:3000

On `:3000` you should see a dark **Host shell** banner and the WatchLog
dashboard underneath. The host loads `http://localhost:3001/remoteEntry.js`
at runtime; it does not compile WatchLog.

**No duplicate singletons:** `docs/STAGE-8-BUNDLE-ANALYSIS.md` plus
`docs/mf-singleton-report.json` (`ok: true` for react, react-dom,
react-router-dom). HTML treemaps: `docs/mf-host-report.html`,
`docs/mf-remote-report.html`. Re-run with `npm run analyze:mf`.

## Two apps

| App | Port | Command |
|-----|------|---------|
| WatchLog remote | 3001 | `npm run dev:remote` |
| Host shell | 3000 | `npm run dev:host` (after `npm install` in `host-shell/`) |

The host does not compile WatchLog. It fetches
`http://localhost:3001/remoteEntry.js` and lazy-imports `watchlog/WatchLogApp`.

Shared contract: `webpack/sharedSingletons.cjs` (React 18.3.1, react-dom
18.3.1, react-router-dom 6.28.0, `singleton: true`, `eager: false`).

## Item 4 — remote inside the host

Verified in the browser on 19 Sep 2026:

- `http://localhost:3000/` shows the host banner and WatchLog dashboard
  (“System Overview”).
- `/watchlist` keeps the host banner and WatchLog filters.
- `/login` keeps the host banner and the Login heading.
- No console errors.
- Network: `remoteEntry.js` and `src_remote_WatchLogApp_tsx.js` from
  **:3001**. React, react-dom, and react-router-dom vendor files from
  **:3000 only**.

## Item 5 — bundle analyzer

```bash
npm run analyze:mf
```

Writes HTML reports, then checks webpack stats:

- `docs/mf-host-report.html`
- `docs/mf-remote-report.html`
- `docs/mf-singleton-report.json`

Findings: `docs/STAGE-8-BUNDLE-ANALYSIS.md`.
