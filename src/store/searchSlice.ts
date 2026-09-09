import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ItemType, SearchResult } from '../types/watchlistItem';

export interface SearchState {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
}

const initialState: SearchState = {
  results: [],
  loading: false,
  error: null,
  hasSearched: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    searchRequested(
      state,
      _action: PayloadAction<{ query: string; type: ItemType }>,
    ) {
      state.loading = true;
      state.error = null;
    },
    searchSucceeded(state, action: PayloadAction<SearchResult[]>) {
      state.loading = false;
      state.results = action.payload;
      state.hasSearched = true;
      state.error = null;
    },
    searchFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.results = [];
      state.hasSearched = true;
      state.error = action.payload;
    },
    searchCleared(state) {
      state.results = [];
      state.loading = false;
      state.error = null;
      state.hasSearched = false;
    },
  },
});

export const { searchRequested, searchSucceeded, searchFailed, searchCleared } =
  searchSlice.actions;
export const searchReducer = searchSlice.reducer;