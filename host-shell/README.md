# WatchLog host shell

A separate Webpack 5 app that loads the WatchLog remote at runtime. It does
not compile WatchLog source. It fetches `remoteEntry.js` and renders
`watchlog/WatchLogApp`.

## Run

From the WatchLog repo (remote must be running first):

```bash
# terminal 1 — from watchLogProject
npm run dev:remote

# terminal 2 — from host-shell
npm install
npm run dev
```

Open `http://localhost:3000`. The host banner is the proof you are in the
shell, not the standalone remote on port 3001.

React, React DOM, and `react-router-dom` are shared singletons in both
Webpack configs (`webpack/sharedSingletons.cjs`). That is what keeps one
React tree on the page.

Analyzer reports live in `docs/mf-host-report.html` and
`docs/mf-remote-report.html`. Summary: `docs/STAGE-8-BUNDLE-ANALYSIS.md`.
