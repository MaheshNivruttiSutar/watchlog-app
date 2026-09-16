import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';
import { mockWatchlist } from './mockData.js';
import { queryKeys } from '../query/keys.js';
import type { WatchlistItem } from '../types/watchlistItem.js';
import { withUpdatedRating } from '../utils/watchlistView.js';

describe('optimistic rating cache', () => {
  it('writes the new rating then restores the snapshot on failure', () => {
    const client = new QueryClient();
    const previous = [mockWatchlist[0]];
    client.setQueryData(queryKeys.watchlist, previous);

    client.setQueryData(queryKeys.watchlist, (items: WatchlistItem[] | undefined) =>
      withUpdatedRating(items ?? [], mockWatchlist[0].id, 1),
    );
    expect(client.getQueryData<WatchlistItem[]>(queryKeys.watchlist)?.[0].rating).toBe(
      1,
    );

    client.setQueryData(queryKeys.watchlist, previous);
    expect(client.getQueryData<WatchlistItem[]>(queryKeys.watchlist)?.[0].rating).toBe(
      mockWatchlist[0].rating,
    );
  });
});
