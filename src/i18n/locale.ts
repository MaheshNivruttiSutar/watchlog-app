export const LOCALES = ['en', 'hi'] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_STORAGE_KEY = 'watchlog-locale';

export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'en' || value === 'hi';
}

export function getStoredLocale(): Locale | null {
  if (typeof localStorage === 'undefined') return null;
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return isLocale(stored) ? stored : null;
}

export function getInitialLocale(): Locale {
  return getStoredLocale() ?? DEFAULT_LOCALE;
}

export function applyDocumentLang(locale: Locale): void {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = locale;
}
