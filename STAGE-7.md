# Stage 7 — i18n, search performance, compound grid

**Branch:** `stage-7`  
**Goal:** Internationalize the UI, stop wasted search re-renders, and split the watchlist grid into a compound API.

## What this stage is for

Stage 7 is three separate skills that happen to share a UI:

1. **i18n** — every user-facing string lives in catalogs, not inside JSX. English
   and Hindi switch at runtime. Movie/book *titles* stay in the language the
   APIs return; we do not translate TMDB or Open Library data.
2. **Search performance** — typing stays instant, search requests wait for a
   pause, and result tiles skip work when their props have not changed.
3. **Compound components** — `WatchlistGrid` owns layout and actions; callers
   compose `Card`, `Cover`, `Meta`, and `Remove` without duplicating list markup.

## i18n

- Catalogs: `src/i18n/en.ts` (source of keys) and `src/i18n/hi.ts`.
- Types: `src/i18n/i18next.d.ts` so `t('…')` only accepts real keys.
- Locale choice lives in Zustand (`uiStore.locale`) because it is UI state that
  must survive refresh. Dictionaries live in i18next because that library is
  built to interpolate and switch languages.
- `LanguageToggle` writes both the store and `i18n.changeLanguage`.
- Errors from search/popular map through `getSearchErrorKey` into catalog keys
  so the UI never shows a raw English exception string.

## Live search

- The input updates Zustand on every keystroke. That is the *urgent* path.
- `useDebouncedValue` (300 ms) is the *expensive* path: it is the value that
  becomes the TanStack Query key.
- Enter still searches immediately (`form` submit) without waiting for debounce.
- There is no Search button. Debounce plus Enter already cover “wait” and
  “now”. A second control would duplicate those two jobs.
- `useDeferredValue` keeps painting the previous result list while React
  prepares the next one.
- `SearchResultCard` and `SearchResults` are memoized. Add/remove handlers are
  `useCallback` so memo has stable function props to compare.

## Compound `WatchlistGrid`

Dashboard and List both render:

```tsx
<WatchlistGrid items={items} onRemove={…} empty={…}>
  {(item) => (
    <WatchlistGrid.Card item={item}>
      <WatchlistGrid.Cover />
      <WatchlistGrid.Meta />
      <WatchlistGrid.Remove />
    </WatchlistGrid.Card>
  )}
</WatchlistGrid>
```

Context carries grid actions and the current item so Cover/Meta/Remove do not
need a long prop chain. Using a part outside a Card throws in development.

## Profiling evidence

React `<Profiler>` wraps `SearchBar` and `SearchResults` on `/add`. That is the
same commit callback React DevTools Profiler uses. Item 3’s two wasted
components are **`SearchResults`** and **`SearchResultCard`**. Numbers and
screenshots: `docs/STAGE-7-PROFILING.md`.
