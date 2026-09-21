import {
  DEFAULT_LOCALE,
  getInitialLocale,
  getStoredLocale,
  isLocale,
  LOCALE_STORAGE_KEY,
} from '../i18n/locale.js';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
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
