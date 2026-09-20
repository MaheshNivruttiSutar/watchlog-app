import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import '../i18n';
import { useUiStore } from '../store/uiStore';
import { server } from './mswServer';

beforeAll(() => {
  process.env.TMDB_API_KEY = 'test-api-key';
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  localStorage.clear();
  if (
    typeof document.documentElement.removeAttribute === 'function'
  ) {
    document.documentElement.removeAttribute('data-theme');
  }
  document.documentElement.lang = 'en';
  useUiStore.setState({
    listType: 'all',
    listStatus: 'all',
    searchQuery: '',
    searchType: 'movie',
    theme: 'light',
    locale: 'en',
  });
  vi.useRealTimers();
});

afterAll(() => {
  server.close();
});
