import { afterEach, describe, expect, it } from 'vitest';
import { en } from '../i18n/en.js';
import { hi } from '../i18n/hi.js';
import { i18n } from '../i18n/index.js';

function collectKeys(
  value: Record<string, unknown>,
  prefix = '',
): string[] {
  return Object.entries(value).flatMap(([key, nestedValue]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof nestedValue === 'string'
      ? [path]
      : collectKeys(nestedValue as Record<string, unknown>, path);
  });
}

afterEach(async () => {
  await i18n.changeLanguage('en');
});

describe('i18n catalogs', () => {
  it('keeps every locale structurally complete', () => {
    expect(collectKeys(hi).sort()).toEqual(collectKeys(en).sort());
  });

  it('switches languages and interpolates values', async () => {
    await i18n.changeLanguage('hi');

    expect(i18n.t('nav.dashboard')).toBe('डैशबोर्ड');
    expect(
      i18n.t('dashboard.itemBreakdown', { movies: 2, books: 3 }),
    ).toBe('2 फिल्में · 3 किताबें');
  });
});
