import { create } from 'zustand';
import type { ItemType, WatchlistStatus } from '../types/watchlistItem';
import {
  applyTheme,
  getInitialTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from '../utils/theme';

export type ListTypeFilter = ItemType | 'all';
export type ListStatusFilter = WatchlistStatus | 'all';

function nextListStatus(
  listType: ListTypeFilter,
  listStatus: ListStatusFilter,
): ListStatusFilter {
  if (listType === 'movie' && listStatus === 'reading') return 'all';
  if (listType === 'book' && listStatus === 'watching') return 'all';
  return listStatus;
}

function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return getInitialTheme();
}

interface UiState {
  listType: ListTypeFilter;
  listStatus: ListStatusFilter;
  setListType: (listType: ListTypeFilter) => void;
  setListStatus: (listStatus: ListStatusFilter) => void;

  searchQuery: string;
  searchType: ItemType;
  setSearchQuery: (searchQuery: string) => void;
  setSearchType: (searchType: ItemType) => void;
  clearSearchQuery: () => void;

  theme: Theme;
  toggleTheme: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  listType: 'all',
  listStatus: 'all',
  setListType: (listType) =>
    set((state) => ({
      listType,
      listStatus: nextListStatus(listType, state.listStatus),
    })),
  setListStatus: (listStatus) => set({ listStatus }),

  searchQuery: '',
  searchType: 'movie',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSearchType: (searchType) => set({ searchType }),
  clearSearchQuery: () => set({ searchQuery: '' }),

  theme: readInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const theme: Theme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(theme);
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      return { theme };
    }),
}));

if (typeof document !== 'undefined') {
  applyTheme(useUiStore.getState().theme);
}
