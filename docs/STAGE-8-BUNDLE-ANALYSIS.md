# Stage 8 — Bundle analysis (host + remote)

Date: 19 Sep 2026.

## How this was generated

```bash
npm run analyze:mf
```

That runs webpack-bundle-analyzer on **both** production builds, then
`scripts/check-mf-singletons.mjs` against the stats JSON.

Open:

- [mf-host-report.html](./mf-host-report.html)
- [mf-remote-report.html](./mf-remote-report.html)

Full webpack stats JSON is git-ignored (several MB). Regenerating the
command above recreates it.

## What “not bundled twice” means

**[Certain]** Webpack still *compiles* a fallback copy of React into each
app so the remote can run alone on :3001. That is not two Reacts at
runtime.

A singleton is duplicated when:

1. One compilation emits **two** package entry modules, or
2. The host page **downloads** React from both :3000 and :3001.

Neither happened.

## Stats check (`docs/mf-singleton-report.json`)

Each of `react`, `react-dom`, and `react-router-dom`:

| Package | Host JS entries | Remote JS entries | Host consume-shared | Remote consume-shared |
|---------|-----------------|-------------------|---------------------|------------------------|
| react | 1 | 1 | 1 | 1 |
| react-dom | 1 | 1 | 1 | 1 |
| react-router-dom | 1 | 1 | 1 | 1 |

`consume-shared` is the Federation stub. The single `javascript/auto`
entry is the **fallback provider** for standalone use.

Checker result: **OK — no singleton bundled twice inside either compilation.**

## Analyzer reports (disk)

Host production (`host-shell/dist`):

- Vendor chunks include one React DOM chunk (~130 KiB) and one
  `react-router-dom` chunk (~83 KiB).
- WatchLog itself is a **6-byte remote pointer**, not the app source.

Remote production (`dist-remote`):

- Same shared fallback vendor chunks (needed to boot without a host).
- `remoteEntry.js` (~7 KiB) plus the WatchLog expose chunk.

## Runtime (host + remote together)

From the host page network log:

| URL | Origin | Role |
|-----|--------|------|
| `vendors-node_modules_react_index_js.js` | :3000 | Host provides React |
| `vendors-node_modules_react-dom_index_js.js` | :3000 | Host provides react-dom |
| `vendors-node_modules_react-router-dom_dist_index_js.js` | :3000 | Host provides the router |
| `remoteEntry.js` | :3001 | Federation catalog |
| `src_remote_WatchLogApp_tsx.js` | :3001 | WatchLog UI |

No React / react-dom / react-router-dom file was requested from :3001
while the host was open. That is the runtime proof of the singleton.

## What this does *not* share

TanStack Query, i18next, and Zustand stay in the remote bundle. Only
React and the router were declared as singletons, as the assignment
required.
