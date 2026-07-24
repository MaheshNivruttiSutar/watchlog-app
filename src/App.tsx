import WatchlistGrid from './components/WatchlistGrid';
import DetailPanel from './components/DetailPanel';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import ThemeToggle from './components/ThemeToggle';
import { WatchlistProvider, useWatchlist } from './context/WatchlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { useSearch } from './hooks/useSearch';
import { useMemo } from 'react';

function AppContent() {
  const { items, addItem, removeItem } = useWatchlist();
  const { results, loading, error, hasSearched, search } = useSearch();

  const existingIds = useMemo(() => new Set(items.map(i => i.id)), [items]);

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">My WatchLog</h1>
        <ThemeToggle />
      </div>

      <SearchBar onSearch={search} loading={loading} error={error} />
      <SearchResults
        results={results}
        hasSearched={hasSearched}
        onAdd={addItem}
        onRemove={removeItem}
        existingIds={Array.from(existingIds)}
      />

      <div className="flex items-start gap-8">
        <WatchlistGrid />
        {items.length > 0 && <DetailPanel />}
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <WatchlistProvider>
        <AppContent />
      </WatchlistProvider>
    </ThemeProvider>
  );
}

export default App;