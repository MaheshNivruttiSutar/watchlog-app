import { createContext, useContext, useState, type ReactNode } from 'react';
import { mockWatchlist } from '../__tests__/mockData';
import type { WatchlistItem } from '../types/watchlistItem';

interface WatchlistContextValue {
  items: WatchlistItem[];
  selectedId: string | null;
  selectedItem: WatchlistItem | null;
  selectItem: (id: string) => void;
  addItem: (item: WatchlistItem) => void;
  removeItem: (id: string) => void;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WatchlistItem[]>(mockWatchlist);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedItem =
    selectedId === null
      ? null
      : items.find((item) => item.id === selectedId) ?? null;

  function selectItem(id: string) {
    setSelectedId(id);
  }

  function addItem(item: WatchlistItem) {
    setItems((prev) => [...prev, item]);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  }

  const value: WatchlistContextValue = {
    items,
    selectedId,
    selectedItem,
    selectItem,
    addItem,
    removeItem,
  };

  return (
    <WatchlistContext.Provider value={value}>
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
