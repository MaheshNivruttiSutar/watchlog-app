# Stage 4 — Polish & Production Readiness

**Branch:** `stage-4`  
**Goal:** Refine UX, add missing interactions, and document the architecture.

## What you implemented

Everything from **Stage 3**, plus:

- **Rating** — `RatingInput` component on detail page
- **Delete flow** — `ConfirmDeleteDialog` before removing items
- **Watchlist persistence** — load/save watchlist in `localStorage`
- **Component polish** — improved cards, search results, sidebar, theme toggle
- **Docs** — `docs/ARCHITECTURE.md` (folder tree, layers, data flow)
- **README** — setup, demo login, routes, live API test instructions
- **Build fixes** — Vercel/Vite config, CSS refinements

## What is NOT in Stage 4

- Watchlist and search state still live in React Context + hooks
- No Redux Toolkit or Redux Saga

## Commands to try

```bash
npm run dev
npm run build
npm test
npm run test:live
```

## Checkpoint

```bash
git checkout stage-4
```
