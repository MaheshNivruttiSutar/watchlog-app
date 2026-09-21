import { mockWatchlist } from './mockData.js';
import {
  addWatchlistItem,
  fetchWatchlist,
  removeWatchlistItem,
  updateWatchlistRating,
  updateWatchlistStatus,
  WatchlistApiError,
} from '../query/watchlistApi.js';
import { loadWatchlist, saveWatchlist } from '../utils/watchlistStorage.js';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe('watchlistApi', () => {
  it('falls back to the seed list when storage is empty', async () => {
    await expect(fetchWatchlist()).resolves.toEqual(mockWatchlist);
  });

  it('adds an item and persists it', async () => {
    saveWatchlist([mockWatchlist[0]]);
    const extra = { ...mockWatchlist[1], id: 'new-1' };
    const next = await addWatchlistItem(extra);
    expect(next.map((item) => item.id)).toEqual([mockWatchlist[0].id, 'new-1']);
    await expect(fetchWatchlist()).resolves.toEqual(next);
  });

  it('does not duplicate an existing id', async () => {
    saveWatchlist([mockWatchlist[0]]);
    const next = await addWatchlistItem(mockWatchlist[0]);
    expect(next).toHaveLength(1);
  });

  it('removes an item by id', async () => {
    saveWatchlist([mockWatchlist[0], mockWatchlist[1]]);
    const next = await removeWatchlistItem(mockWatchlist[0].id);
    expect(next.map((item) => item.id)).toEqual([mockWatchlist[1].id]);
  });

  it('updates status and rating', async () => {
    saveWatchlist([mockWatchlist[0]]);
    const withStatus = await updateWatchlistStatus(mockWatchlist[0].id, 'done');
    expect(withStatus[0].status).toBe('done');
    const withRating = await updateWatchlistRating(mockWatchlist[0].id, 5);
    expect(withRating[0].rating).toBe(5);
  });

  it('does not persist a rating when simulateFailure is true', async () => {
    const seeded = { ...mockWatchlist[0], rating: 5 };
    saveWatchlist([seeded]);

    await expect(
      updateWatchlistRating(seeded.id, 1, { simulateFailure: true }),
    ).rejects.toBeInstanceOf(WatchlistApiError);

    expect(loadWatchlist()?.[0].rating).toBe(5);
  });
});
