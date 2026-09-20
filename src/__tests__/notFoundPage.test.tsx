import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { i18n } from '../i18n';
import NotFoundPage from '../pages/NotFoundPage';
import { renderWithProviders } from './renderWithProviders';

describe('NotFoundPage', () => {
  it('offers recovery links to the dashboard and watchlist', () => {
    renderWithProviders(<NotFoundPage />, {
      initialEntries: ['/does-not-exist'],
    });

    expect(
      screen.getByRole('heading', { name: i18n.t('notFound.title') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: i18n.t('notFound.dashboard') }),
    ).toHaveAttribute('href', '/');
    expect(
      screen.getByRole('link', { name: i18n.t('notFound.watchlist') }),
    ).toHaveAttribute('href', '/watchlist');
  });
});
