import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { i18n } from '../i18n';
import DashboardPage from '../pages/DashboardPage';
import {
  getRecentlyAdded,
  getWatchlistStatistics,
} from '../utils/watchlistView';
import { saveWatchlist } from '../utils/watchlistStorage';
import { mockWatchlist } from './mockData';
import { renderWithProviders } from './renderWithProviders';

describe('DashboardPage', () => {
  it('shows derived stats and the most recently added titles', async () => {
    saveWatchlist(mockWatchlist);
    const stats = getWatchlistStatistics(mockWatchlist);
    const recentTitles = getRecentlyAdded(mockWatchlist).map(
      (item) => item.title,
    );
    renderWithProviders(<DashboardPage />);

    expect(
      await screen.findByText(
        i18n.t('dashboard.itemBreakdown', {
          movies: stats.movieCount,
          books: stats.bookCount,
        }),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        i18n.t('dashboard.percentDone', { rate: stats.completionRate }),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: i18n.t('dashboard.percentComplete', {
          rate: stats.completionRate,
        }),
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('dashboard.basedOnRatings')),
    ).toBeInTheDocument();
    for (const title of recentTitles) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it('falls back to placeholders when nothing is saved', async () => {
    saveWatchlist([]);
    renderWithProviders(<DashboardPage />);

    expect(await screen.findByText('—')).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('dashboard.noRatings')),
    ).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('dashboard.percentDone', { rate: 0 })),
    ).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('dashboard.empty')),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: i18n.t('dashboard.searchAndAdd'),
      }),
    ).toHaveAttribute('href', '/add');
  });
});
