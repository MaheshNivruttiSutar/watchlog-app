import { create } from 'zustand';
import { applyLocale } from '../i18n';
import {
  DEFAULT_LOCALE,
  getInitialLocale,
  LOCALE_STORAGE_KEY,
  type Locale,
} from '../i18n/locale';
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

function readInitialLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  return getInitialLocale();
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

  locale: Locale;
  setLocale: (locale: Locale) => void;
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

  locale: readInitialLocale(),
  setLocale: (locale) => {
    void applyLocale(locale);
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    set({ locale });
  },
}));

if (typeof document !== 'undefined') {
  applyTheme(useUiStore.getState().theme);
  void applyLocale(useUiStore.getState().locale);
}
