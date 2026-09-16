import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useUiStore } from '../store/uiStore.js';
import { THEME_STORAGE_KEY } from '../utils/theme.js';

const uiDefaults = {
  listType: 'all' as const,
  listStatus: 'all' as const,
  searchQuery: '',
  searchType: 'movie' as const,
  theme: 'light' as const,
};

function createMemoryStorage(): Storage {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index) {
      return [...store.keys()][index] ?? null;
    },
    removeItem(key) {
      store.delete(key);
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
  };
}

beforeEach(() => {
  vi.stubGlobal('localStorage', createMemoryStorage());
  vi.stubGlobal('document', {
    documentElement: { dataset: {} as Record<string, string> },
  });
});

afterEach(() => {
  useUiStore.setState(uiDefaults);
  vi.unstubAllGlobals();
});

describe('uiStore', () => {
  it('clears reading when list type becomes movie', () => {
    useUiStore.getState().setListStatus('reading');
    useUiStore.getState().setListType('movie');
    expect(useUiStore.getState().listType).toBe('movie');
    expect(useUiStore.getState().listStatus).toBe('all');
  });

  it('clears watching when list type becomes book', () => {
    useUiStore.getState().setListStatus('watching');
    useUiStore.getState().setListType('book');
    expect(useUiStore.getState().listStatus).toBe('all');
  });

  it('keeps watching when list type becomes movie', () => {
    useUiStore.getState().setListStatus('watching');
    useUiStore.getState().setListType('movie');
    expect(useUiStore.getState().listStatus).toBe('watching');
  });

  it('keeps reading when list type becomes book', () => {
    useUiStore.getState().setListStatus('reading');
    useUiStore.getState().setListType('book');
    expect(useUiStore.getState().listStatus).toBe('reading');
  });

  it('clears only the search query text', () => {
    useUiStore.getState().setSearchQuery('dune');
    useUiStore.getState().setSearchType('book');
    useUiStore.getState().clearSearchQuery();
    expect(useUiStore.getState().searchQuery).toBe('');
    expect(useUiStore.getState().searchType).toBe('book');
  });

  it('toggles light to dark and persists it', () => {
    useUiStore.getState().toggleTheme();
    expect(useUiStore.getState().theme).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('toggles dark back to light', () => {
    useUiStore.getState().toggleTheme();
    useUiStore.getState().toggleTheme();
    expect(useUiStore.getState().theme).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });
});
