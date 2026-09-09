import { describe, expect, it } from 'vitest';
import { mockWatchlist } from './mockData.js';
import {
  addItem,
  removeItem,
  setRating,
  updateStatus,
  watchlistReducer,
  type WatchlistState,
} from '../store/watchlistSlice.js';

const emptyState: WatchlistState = { items: [] };

describe('watchlistSlice', () => {
  it('adds an item', () => {
    const next = watchlistReducer(emptyState, addItem(mockWatchlist[0]));
    expect(next.items).toEqual([mockWatchlist[0]]);
  });

  it('removes an item by id', () => {
    const seeded: WatchlistState = { items: [mockWatchlist[0], mockWatchlist[1]] };
    const next = watchlistReducer(seeded, removeItem('1'));
    expect(next.items.map((item) => item.id)).toEqual(['2']);
  });

  it('updates status for one item', () => {
    const seeded: WatchlistState = { items: [mockWatchlist[1]] };
    const next = watchlistReducer(
      seeded,
      updateStatus({ id: '2', status: 'done' }),
    );
    expect(next.items[0].status).toBe('done');
  });

  it('sets rating for one item', () => {
    const seeded: WatchlistState = { items: [mockWatchlist[1]] };
    const next = watchlistReducer(seeded, setRating({ id: '2', rating: 4 }));
    expect(next.items[0].rating).toBe(4);
  });

  it('ignores updateStatus when the id is missing', () => {
    const seeded: WatchlistState = { items: [mockWatchlist[0]] };
    const next = watchlistReducer(
      seeded,
      updateStatus({ id: 'missing', status: 'done' }),
    );
    expect(next.items).toEqual(seeded.items);
  });
});
