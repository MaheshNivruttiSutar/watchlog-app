import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockWatchlist } from './mockData.js';
import {
  loadWatchlist,
  saveWatchlist,
  WATCHLIST_STORAGE_KEY,
} from '../utils/watchlistStorage.js';

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
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('loadWatchlist', () => {
  it('returns null when nothing is stored', () => {
    expect(loadWatchlist()).toBeNull();
  });

  it('returns null for invalid JSON', () => {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, '{not-json');
    expect(loadWatchlist()).toBeNull();
  });

  it('returns null when stored value is not an array', () => {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify({ items: [] }));
    expect(loadWatchlist()).toBeNull();
  });

  it('returns null when an item has an invalid status', () => {
    const invalid = [{ ...mockWatchlist[0], status: 'paused' }];
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(invalid));
    expect(loadWatchlist()).toBeNull();
  });

  it('returns an empty array when the user cleared the list', () => {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify([]));
    expect(loadWatchlist()).toEqual([]);
  });

  it('returns the saved items when every item is valid', () => {
    saveWatchlist(mockWatchlist);
    expect(loadWatchlist()).toEqual(mockWatchlist);
  });
});

describe('saveWatchlist', () => {
  it('writes JSON under the watchlist key', () => {
    saveWatchlist(mockWatchlist);
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    expect(raw).toBe(JSON.stringify(mockWatchlist));
  });
});
