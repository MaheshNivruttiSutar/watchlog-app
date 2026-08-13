import { createContext, useContext, useState, type ReactNode } from 'react';
import { mockWatchlist } from '../__tests__/mockData';
import type { WatchlistItem } from '../types/watchlistItem';

/**
 * Shared watchlist for the whole app.
 *
 * Any page can:
 * - read items
 * - addItem(...)
 * - updateItem(id, patch)
 * - removeItem(id)
 */
const WatchlistContext = createContext<{
  items: WatchlistItem[];
  addItem: (item: WatchlistItem) => void;
  updateItem: (id: string, patch: Partial<WatchlistItem>) => void;
  removeItem: (id: string) => void;
} | null>(null);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WatchlistItem[]>(mockWatchlist);

  function addItem(item: WatchlistItem) {
    setItems((current) => [...current, item]);
  }

  function updateItem(id: string, patch: Partial<WatchlistItem>) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <WatchlistContext.Provider value={{ items, addItem, updateItem, removeItem }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);

  if (!context) {
    throw new Error('useWatchlist must be used inside WatchlistProvider');
  }

  return context;
}
