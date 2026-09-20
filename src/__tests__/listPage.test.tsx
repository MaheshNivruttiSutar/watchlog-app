import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ListPage from '../pages/ListPage';
import { saveWatchlist } from '../utils/watchlistStorage';
import { mockWatchlist } from './mockData';
import { renderWithProviders } from './renderWithProviders';

describe('ListPage', () => {
  it('renders saved items and filters them by type and status', async () => {
    saveWatchlist(mockWatchlist);
    const user = userEvent.setup();
    renderWithProviders(<ListPage />, {
      initialEntries: ['/watchlist'],
    });

    expect(await screen.findByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('Dune')).toBeInTheDocument();

    const typeFilters = screen.getByRole('radiogroup', {
      name: 'Filter by type',
    });
    await user.click(within(typeFilters).getByRole('radio', {
      name: 'Movies',
    }));

    await waitFor(() =>
      expect(screen.queryByText('Dune')).not.toBeInTheDocument(),
    );
    expect(screen.getByText('Inception')).toBeInTheDocument();

    const statusFilters = screen.getByRole('radiogroup', {
      name: 'Filter by status',
    });
    await user.click(within(statusFilters).getByRole('radio', {
      name: 'Want',
    }));

    expect(await screen.findByText('Interstellar')).toBeInTheDocument();
    expect(screen.queryByText('Inception')).not.toBeInTheDocument();
    expect(screen.queryByText('The Hobbit')).not.toBeInTheDocument();
  });

  it('renders the empty state when the saved list has no items', async () => {
    saveWatchlist([]);
    renderWithProviders(<ListPage />, {
      initialEntries: ['/watchlist'],
    });

    expect(
      await screen.findByText('No items match these filters.'),
    ).toBeInTheDocument();
  });
});
