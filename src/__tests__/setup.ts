import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import '../i18n';
import { useUiStore } from '../store/uiStore';
import { server } from './mswServer';

beforeAll(() => {
  process.env.TMDB_API_KEY = 'test-api-key';
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  localStorage.clear();
  if (typeof document.documentElement.removeAttribute === 'function') {
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
  jest.useRealTimers();
});

afterAll(() => {
  server.close();
});
