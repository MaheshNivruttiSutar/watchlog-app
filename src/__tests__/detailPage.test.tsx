import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import DetailPage from '../pages/DetailPage';
import { saveWatchlist } from '../utils/watchlistStorage';
import { mockWatchlist } from './mockData';
import { renderWithProviders } from './renderWithProviders';

function renderDetail(id: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/items/:id" element={<DetailPage />} />
    </Routes>,
    { initialEntries: [`/items/${encodeURIComponent(id)}`] },
  );
}

describe('DetailPage', () => {
  it('shows a loading message while the watchlist resolves', () => {
    saveWatchlist(mockWatchlist);
    renderDetail(mockWatchlist[0].id);

    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('shows a not-found message for an unknown id', async () => {
    saveWatchlist(mockWatchlist);
    renderDetail('movie-does-not-exist');

    expect(await screen.findByText('Item not found.')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Back to list' }),
    ).toBeInTheDocument();
  });

  it('reverts the rating and warns when the server rejects the save', async () => {
    const ratedMovie = { ...mockWatchlist[0], rating: 3 };
    saveWatchlist([ratedMovie]);
    const user = userEvent.setup();
    renderDetail(ratedMovie.id);

    expect(await screen.findByText('3 / 5')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Simulate server failure'));

    const ratingGroup = screen.getByRole('radiogroup', { name: 'Rating' });
    await user.click(within(ratingGroup).getByRole('radio', { name: '5 stars' }));

    expect(await screen.findByText('5 / 5')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Rating was reverted. The server rejected the save.',
        );
      },
      { timeout: 2_000 },
    );
    expect(screen.getByText('3 / 5')).toBeInTheDocument();
  });
});
