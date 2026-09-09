import { runSaga, stdChannel } from 'redux-saga';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { search, SearchApiError } from '../api/search';
import { searchWorker, watchSearch } from '../store/searchSaga';
import {
    searchFailed,
    searchRequested,
    searchSucceeded,
} from '../store/searchSlice';
import type { SearchResult } from '../types/watchlistItem';

vi.mock('../api/search', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../api/search')>();
    return {
        ...actual,
        search: vi.fn(),
    };
});

const dune: SearchResult = {
    externalId: '1',
    type: 'book',
    title: 'Dune',
    genres: [],
};

async function dispatchedFromWorker(
    action: ReturnType<typeof searchRequested>,
) {
    const dispatched: unknown[] = [];

    await runSaga(
        {
            dispatch: (next) => {
                dispatched.push(next);
            },
        },
        searchWorker,
        action,
    ).toPromise();

    return dispatched;
}

afterEach(() => {
    vi.mocked(search).mockReset();
});

describe('searchWorker', () => {
    it('puts searchSucceeded when the API works', async () => {
        vi.mocked(search).mockResolvedValueOnce([dune]);

        const dispatched = await dispatchedFromWorker(
            searchRequested({ query: 'Dune', type: 'book' }),
        );

        expect(search).toHaveBeenCalledTimes(1);
        expect(dispatched).toEqual([searchSucceeded([dune])]);
    });

    it('puts searchFailed on a permanent error without retrying', async () => {
        vi.mocked(search).mockRejectedValueOnce(
            new SearchApiError(
                'TMDB API key is not configured. Set TMDB_API_KEY environment variable.',
                'tmdb',
            ),
        );

        const dispatched = await dispatchedFromWorker(
            searchRequested({ query: 'Dune', type: 'movie' }),
        );

        expect(search).toHaveBeenCalledTimes(1);
        expect(dispatched).toEqual([
            searchFailed(
                'TMDB API key is not configured. Set TMDB_API_KEY environment variable.',
            ),
        ]);
    });
});

describe('watchSearch cancellation', () => {
    it('cancels the first search when a newer one arrives', async () => {
        let finishFirst!: (value: SearchResult[]) => void;

        vi.mocked(search)
            .mockImplementationOnce(
                () =>
                    new Promise((resolve) => {
                        finishFirst = resolve;
                    }),
            )
            .mockResolvedValueOnce([dune]);

        const dispatched: unknown[] = [];
        const channel = stdChannel();

        const task = runSaga(
            {
                channel,
                dispatch: (next) => {
                    dispatched.push(next);
                },
            },
            watchSearch,
        );

        channel.put(searchRequested({ query: 'Du', type: 'book' }));
        await Promise.resolve();
        channel.put(searchRequested({ query: 'Dune', type: 'book' }));

        await vi.waitFor(() => {
            expect(dispatched).toEqual([searchSucceeded([dune])]);
        });

        finishFirst([{ ...dune, title: 'STALE' }]);
        await Promise.resolve();

        expect(dispatched).toEqual([searchSucceeded([dune])]);
        expect(dispatched).not.toContainEqual(
            searchSucceeded([{ ...dune, title: 'STALE' }]),
        );

        task.cancel();
    });
});