# Stage 7 — Search profiling

## Interaction under test

On `/add`, start with an empty search field and type `dune` rapidly without
pressing Enter.

React development mode may render extra times (Strict Mode / concurrent
retries). Compare **before vs after**, do not treat a raw count as production.

Recordings use React’s `<Profiler onRender>` API — the same commit callback
React DevTools Profiler visualizes. Named subtrees: `SearchBar` and
`SearchResults`. Card waste is visible as `SearchResultCard` function-body
runs inside those `SearchResults` commits.

- **Before:** `localStorage.watchlog-profile=1` and
  `watchlog-profile-baseline=1` (debounce 0, memo/deferred off).
- **After:** profile flag only (300 ms debounce, `React.memo`, `useDeferredValue`).

## Two wasted renders (item 3)

These are the two components that did unnecessary work **before** memo/debounce:

### 1. `SearchResults`

**Why it rendered:** each keystroke updated the search query key immediately.
That changed `results` / `loading`, so the whole results section committed
again — including empty/loading states and the full `results.map`.

**Evidence:** Profiler commits for `SearchResults` while typing `dune`:
**12 (before) → 2 (after)**.

### 2. `SearchResultCard`

**Why it rendered:** cards were not a memoized boundary. When `SearchResults`
committed, every visible tile ran again even when that tile’s `result` and
`alreadyAdded` flag had not changed.

**Evidence:** function-body runs for `SearchResultCard`:
**480 (before) → 40 (after)**.

`SearchBar` still commits on typing. That is **not** waste. The input must
re-render so the letters appear immediately.

## Changes applied (item 4)

- `useDebouncedValue` (300 ms) delays the query key; the Zustand input stays live.
- `useDeferredValue` keeps the previous result array on screen while React
  prepares the next list.
- `React.memo` on `SearchResultCard` / `SearchResults` plus stable
  `useCallback` add/remove handlers.

## Recordings

- `docs/search-profile-before.png` / `docs/search-profile-before.json`
- `docs/search-profile-after.png` / `docs/search-profile-after.json`

### Before

- `SearchResults` Profiler commits: `12`
- `SearchBar` Profiler commits: `20`
- `SearchResultCard` renders: `480`
- `SearchResults` function-body runs: `24`
- Longest Profiler `actualDuration`: `3.0 ms`

### After

- `SearchResults` Profiler commits: `2`
- `SearchBar` Profiler commits: `7`
- `SearchResultCard` renders: `40`
- `SearchResults` function-body runs: `4`
- Longest Profiler `actualDuration`: `3.6 ms`

The longest commit did **not** drop. The first paint of ~20 result tiles still
costs a few milliseconds. The win is **how often** the list and cards run, not
the cost of one successful result paint.

## Expected invariant

Typing four letters quickly should update the input four times but issue one
search request after typing pauses. Existing cards should render again only
when their props change or the locale changes.

## Optional DevTools screenshot

If a reviewer wants the flamegraph UI: Chrome → React DevTools → Profiler →
Record → type `dune` → stop. Enable “Record why each component rendered”.
Export sits next to these JSON files. The numbers above already come from
that same Profiler pipeline.
