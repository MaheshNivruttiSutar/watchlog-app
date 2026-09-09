# Stage 3 — Multi-Page App + Auth

**Branch:** `stage-3`  
**Goal:** Turn the single-page shell into a routed app with fake login.

## What you implemented

Everything from **Stage 2**, plus:

- **React Router** — dedicated pages under `src/pages/`
  - `DashboardPage` (`/`)
  - `ListPage` (`/watchlist`)
  - `DetailPage` (`/items/:id`)
  - `AddEditPage` (`/add`) — search & add
  - `LoginPage` (`/login`)
  - `NotFoundPage` (`*`)
- **Layout** — `Sidebar` navigation
- **Auth** — `AuthContext` + `ProtectedRoute` (Search requires login)
- **Demo users** — `data/localStorage.tsx` seeds users into `localStorage`
- **Popular hook** — `usePopular.ts` for trending titles on Search
- **Styling** — expanded `App.css` for full app layout

## What is NOT in Stage 3

- No rating input or delete confirmation dialog
- Watchlist still uses React Context (not Redux)
- Search still uses `useSearch` hook (not Redux Saga)

## Commands to try

```bash
npm run dev
# Log in with arjunsharma@demo.com / 123, then visit /add
```

## Checkpoint

```bash
git checkout stage-3
```
