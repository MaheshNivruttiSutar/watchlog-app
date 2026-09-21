import {
  countRender,
  getProfilerCommits,
  getRenderCounts,
  isProfileBaseline,
  onSearchProfilerRender,
  PROFILE_BASELINE_STORAGE_KEY,
  PROFILE_STORAGE_KEY,
  resetRenderCounts,
  summarizeProfiler,
} from '../debug/renderCounts';

beforeEach(() => {
  window.localStorage.clear();
  resetRenderCounts();
});

afterEach(() => {
  window.localStorage.clear();
  resetRenderCounts();
});

describe('renderCounts', () => {
  it('ignores counts until the profile flag is set', () => {
    countRender('SearchBar');
    expect(getRenderCounts()).toEqual({});
  });

  it('increments named renders when profiling is on', () => {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, '1');
    countRender('SearchBar');
    countRender('SearchBar');
    countRender('SearchResults');
    expect(getRenderCounts()).toEqual({
      SearchBar: 2,
      SearchResults: 1,
    });
  });

  it('clears counts on reset', () => {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, '1');
    countRender('SearchBar');
    resetRenderCounts();
    expect(getRenderCounts()).toEqual({});
  });

  it('reads the baseline flag from localStorage', () => {
    expect(isProfileBaseline()).toBe(false);
    window.localStorage.setItem(PROFILE_BASELINE_STORAGE_KEY, '1');
    expect(isProfileBaseline()).toBe(true);
  });

  it('records Profiler commits only when the profile flag is on', () => {
    onSearchProfilerRender('SearchResults', 'update', 4, 10, 0, 1);
    expect(getProfilerCommits()).toEqual([]);

    window.localStorage.setItem(PROFILE_STORAGE_KEY, '1');
    onSearchProfilerRender('SearchResults', 'update', 4, 10, 0, 1);
    onSearchProfilerRender('SearchBar', 'update', 1, 1, 0, 2);
    expect(summarizeProfiler(getProfilerCommits())).toEqual({
      commitsById: { SearchResults: 1, SearchBar: 1 },
      longestCommitMs: 4,
    });
  });
});
