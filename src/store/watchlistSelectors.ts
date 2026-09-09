import { createSelector } from '@reduxjs/toolkit';
import type { ItemType, WatchlistStatus } from '../types/watchlistItem';
import { calculateStatistics } from '../utils/statistics';
import { sortByDateAdded } from '../utils/sort';
import type { RootState } from './index';

export const selectWatchlistItems = (state: RootState) => state.watchlist.items;

export const selectWatchlistStatistics = createSelector(
  [selectWatchlistItems],
  (items) => calculateStatistics(items),
);

export const selectRecentlyAdded = createSelector(
  [selectWatchlistItems],
  (items) => sortByDateAdded(items, 'desc').slice(0, 5),
);

export const selectFilteredWatchlistItems = createSelector(
  [
    selectWatchlistItems,
    (_state: RootState, type: ItemType | 'all') => type,
    (
      _state: RootState,
      _type: ItemType | 'all',
      status: WatchlistStatus | 'all',
    ) => status,
  ],
  (items, type, status) =>
    items.filter((item) => {
      const typeOk = type === 'all' || item.type === type;
      const statusOk = status === 'all' || item.status === status;
      return typeOk && statusOk;
    }),
);