import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { setLocalStorage } from '../data/localStorage';
import { queryClient } from '../query/queryClient';
import {
  loadWatchlist,
  saveWatchlist,
} from '../utils/watchlistStorage';
import { openLibrarySearchUrl, server } from './mswServer';

describe('WatchLog user journey', () => {
  beforeEach(() => {
    queryClient.clear();
    setLocalStorage();
    saveWatchlist([]);
  });

  it('searches, adds an item, changes its status, and rates it', async () => {
    server.use(
      http.get(openLibrarySearchUrl, () =>
        HttpResponse.json({
          docs: [
            {
              key: '/works/OL893415W',
              title: 'Dune',
              author_name: ['Frank Herbert'],
              first_publish_year: 1965,
              subject: ['Science Fiction', 'Adventure'],
              cover_i: 9255566,
            },
          ],
        }),
      ),
    );
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>,
    );

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrong');
    await user.click(screen.getByRole('button', { name: 'Log in' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Invalid email or password',
    );

    await user.clear(emailInput);
    await user.clear(passwordInput);
    await user.type(emailInput, 'arjunsharma@demo.com');
    await user.type(passwordInput, '123');
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    const searchInput = await screen.findByRole('textbox', {
      name: 'Search titles, authors, or directors',
    });
    await user.click(screen.getByRole('radio', { name: 'Books' }));
    await user.type(searchInput, 'Dune{enter}');

    expect(await screen.findByText('Dune')).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Add to Watchlist' }),
    );
    await screen.findByRole('button', { name: 'Remove' });

    await user.click(screen.getByRole('link', { name: 'Watchlist' }));
    await user.click(
      await screen.findByRole('link', { name: 'Open Dune' }),
    );

    const statusGroup = await screen.findByRole('radiogroup', {
      name: 'Status',
    });
    await user.click(
      within(statusGroup).getByRole('radio', { name: 'Done' }),
    );

    const ratingGroup = screen.getByRole('radiogroup', { name: 'Rating' });
    await user.click(
      within(ratingGroup).getByRole('radio', { name: '4 stars' }),
    );

    expect(await screen.findByText('4 / 5')).toBeInTheDocument();
    await waitFor(
      () => {
        const dune = loadWatchlist()?.find(
          (item) => item.id === 'book-works-OL893415W',
        );
        expect(dune).toMatchObject({ status: 'done', rating: 4 });
      },
      { timeout: 2_000 },
    );
  });
});
