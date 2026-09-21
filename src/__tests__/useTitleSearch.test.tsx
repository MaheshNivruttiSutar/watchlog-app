import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import type { ReactNode } from 'react';
import { SearchApiError } from '../api/search';
import {
  getSearchErrorKey,
  useTitleSearch,
} from '../hooks/useTitleSearch';
import type { ItemType } from '../types/watchlistItem';
import { openLibrarySearchUrl, server } from './mswServer';
import { createTestQueryClient } from './renderWithProviders';

function renderSearchHook(
  query: string,
  type: ItemType = 'book',
  enabled = true,
) {
  const queryClient = createTestQueryClient();

  return renderHook(() => useTitleSearch(query, type, enabled), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    ),
  });
}

describe('useTitleSearch', () => {
  it('exposes the initial loading state while a request is pending', () => {
    server.use(
      http.get(openLibrarySearchUrl, async () => {
        await delay('infinite');
        return HttpResponse.json({ docs: [] });
      }),
    );

    const { result } = renderSearchHook('dune');

    expect(result.current.isPending).toBe(true);
    expect(result.current.isFetching).toBe(true);
  });

  it('returns mapped results after a successful response', async () => {
    server.use(
      http.get(openLibrarySearchUrl, () =>
        HttpResponse.json({
          docs: [
            {
              key: '/works/OL893415W',
              title: 'Dune',
              author_name: ['Frank Herbert'],
              first_publish_year: 1965,
              subject: ['Science Fiction'],
            },
          ],
        }),
      ),
    );

    const { result } = renderSearchHook('dune');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([
      expect.objectContaining({
        externalId: 'works-OL893415W',
        title: 'Dune',
        type: 'book',
      }),
    ]);
  });

  it('exposes an API error when the response fails', async () => {
    server.use(
      http.get(openLibrarySearchUrl, () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    );

    const { result } = renderSearchHook('dune');

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(SearchApiError);
  });

  it('does not request data when disabled or given a blank query', () => {
    const disabled = renderSearchHook('dune', 'book', false);
    const blank = renderSearchHook('   ');

    expect(disabled.result.current.fetchStatus).toBe('idle');
    expect(blank.result.current.fetchStatus).toBe('idle');
  });
});

describe('getSearchErrorKey', () => {
  it('maps technical failures to safe UI message keys', () => {
    expect(
      getSearchErrorKey(
        new SearchApiError(
          'Network error while searching books',
          'openLibrary',
        ),
      ),
    ).toBe('errors.network');
    expect(
      getSearchErrorKey(
        new SearchApiError(
          'TMDB API key is not configured',
          'tmdb',
        ),
      ),
    ).toBe('errors.tmdbNotConfigured');
    expect(getSearchErrorKey(new Error('unexpected'))).toBe(
      'errors.searchFailed',
    );
    expect(
      getSearchErrorKey(
        new SearchApiError(
          'Open Library returned status 400',
          'openLibrary',
          400,
        ),
      ),
    ).toBe('errors.searchFailed');
  });
});
