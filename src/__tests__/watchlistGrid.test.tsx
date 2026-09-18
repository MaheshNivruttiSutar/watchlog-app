// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import '../i18n';
import WatchlistGrid from '../components/WatchlistGrid';
import { useWatchlistCard } from '../components/WatchlistCard';
import { mockWatchlist } from './mockData';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

function renderWithProviders(node: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  act(() => {
    root.render(
      <QueryClientProvider client={client}>
        <MemoryRouter>{node}</MemoryRouter>
      </QueryClientProvider>,
    );
  });
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  container.remove();
});

describe('WatchlistGrid compound API', () => {
  it('renders the default empty state when there are no items', () => {
    renderWithProviders(
      <WatchlistGrid items={[]}>
        {(item) => (
          <WatchlistGrid.Card key={item.id} item={item}>
            <WatchlistGrid.Meta />
          </WatchlistGrid.Card>
        )}
      </WatchlistGrid>,
    );

    expect(container.textContent).toContain('No items match these filters.');
  });

  it('renders composed card parts for each item', () => {
    renderWithProviders(
      <WatchlistGrid items={[mockWatchlist[0]]}>
        {(item) => (
          <WatchlistGrid.Card key={item.id} item={item}>
            <WatchlistGrid.Cover />
            <WatchlistGrid.Meta />
          </WatchlistGrid.Card>
        )}
      </WatchlistGrid>,
    );

    expect(container.textContent).toContain('Inception');
    expect(container.textContent).toContain('2010');
  });

  it('throws when a card part is used outside Card', () => {
    function BrokenPart() {
      useWatchlistCard();
      return null;
    }

    expect(() => {
      renderWithProviders(<BrokenPart />);
    }).toThrow('WatchlistGrid card parts must be rendered inside WatchlistGrid.Card');
  });
});
