import { act, screen } from '@testing-library/react';
import SearchProfileHud from '../components/SearchProfileHud';
import {
  PROFILE_STORAGE_KEY,
  resetRenderCounts,
} from '../debug/renderCounts';
import { renderWithProviders } from './renderWithProviders';

afterEach(() => {
  resetRenderCounts();
});

describe('SearchProfileHud', () => {
  it('stays hidden unless the profile flag is set', () => {
    renderWithProviders(<SearchProfileHud />);
    expect(screen.queryByText('Search Profiler')).not.toBeInTheDocument();
  });

  it('polls render counts while the profile flag is on', () => {
    localStorage.setItem(PROFILE_STORAGE_KEY, '1');
    window.__WATCHLOG_RENDERS__ = { SearchBar: 3 };
    window.__WATCHLOG_PROFILER__ = [
      {
        id: 'SearchBar',
        phase: 'update',
        actualDuration: 2.5,
        baseDuration: 1,
        commitTime: 1,
      },
    ];

    jest.useFakeTimers();
    renderWithProviders(<SearchProfileHud />);

    expect(screen.getByText('Search Profiler')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(screen.getByText(/"SearchBar": 3/)).toBeInTheDocument();
    expect(screen.getByText(/"longestCommitMs": 2.5/)).toBeInTheDocument();
  });
});
