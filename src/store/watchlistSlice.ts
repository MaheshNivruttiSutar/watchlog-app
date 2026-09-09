import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { WatchlistItem, WatchlistStatus } from '../types/watchlistItem';
import { mockWatchlist } from '../__tests__/mockData';
import { loadWatchlist } from '../utils/watchlistStorage';

export interface WatchlistState {
  items: WatchlistItem[];
}

const initialState: WatchlistState = {
  items: loadWatchlist() ?? mockWatchlist,
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<WatchlistItem>) {
      state.items.push(action.payload);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateStatus(
      state,
      action: PayloadAction<{ id: string; status: WatchlistStatus }>,
    ) {
      const item = state.items.find((entry) => entry.id === action.payload.id);
      if (!item) return;
      item.status = action.payload.status;
    },
    setRating(
      state,
      action: PayloadAction<{ id: string; rating: number | null }>,
    ) {
      const item = state.items.find((entry) => entry.id === action.payload.id);
      if (!item) return;
      item.rating = action.payload.rating;
    },
  },
});

export const { addItem, removeItem, updateStatus, setRating } =
  watchlistSlice.actions;
export const watchlistReducer = watchlistSlice.reducer;