import { describe, expect, it, vi } from 'vitest';
import {
  applyTheme,
  getInitialTheme,
  getStoredTheme,
  getSystemTheme,
  THEME_STORAGE_KEY,
} from '../utils/theme';

describe('theme utilities', () => {
  it('reads only supported values from storage', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    expect(getStoredTheme()).toBe('dark');

    localStorage.setItem(THEME_STORAGE_KEY, 'sepia');
    expect(getStoredTheme()).toBeNull();
  });

  it('uses the operating-system preference when no theme is stored', () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true,
    } as MediaQueryList);

    expect(getSystemTheme()).toBe('dark');
    expect(getInitialTheme()).toBe('dark');
  });

  it('prefers a stored theme and applies it to the document', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');

    expect(getInitialTheme()).toBe('dark');
    applyTheme('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });
});
