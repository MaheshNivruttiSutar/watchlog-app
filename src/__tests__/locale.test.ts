import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_LOCALE,
  getInitialLocale,
  getStoredLocale,
  isLocale,
  LOCALE_STORAGE_KEY,
} from '../i18n/locale.js';

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

describe('locale', () => {
  it('accepts only supported locale codes', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('hi')).toBe(true);
    expect(isLocale('fr')).toBe(false);
    expect(isLocale(null)).toBe(false);
  });

  it('reads a stored locale', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'hi');
    expect(getStoredLocale()).toBe('hi');
    expect(getInitialLocale()).toBe('hi');
  });

  it('ignores unknown stored values', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'fr');
    expect(getStoredLocale()).toBeNull();
    expect(getInitialLocale()).toBe(DEFAULT_LOCALE);
  });
});
