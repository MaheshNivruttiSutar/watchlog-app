import { call, delay, put, takeLatest } from 'redux-saga/effects';
import { isTransientSearchError, search, SearchApiError } from '../api/search';
import type { SearchResult } from '../types/watchlistItem';
import {
  searchFailed,
  searchRequested,
  searchSucceeded,
} from './searchSlice';

export const SEARCH_MAX_ATTEMPTS = 3;
export const SEARCH_RETRY_DELAY_MS = 300;

function toSearchErrorMessage(error: unknown): string {
  return error instanceof SearchApiError
    ? error.message
    : 'Something went wrong. Please try again.';
}

export function* searchWorker(action: ReturnType<typeof searchRequested>) {
  const { query, type } = action.payload;
  const trimmed = query.trim();

  if (!trimmed) {
    return;
  }

  for (let attempt = 1; attempt <= SEARCH_MAX_ATTEMPTS; attempt += 1) {
    try {
      const results = (yield call(search, trimmed, type)) as SearchResult[];
      yield put(searchSucceeded(results));
      return;
    } catch (error) {
      const canRetry =
        isTransientSearchError(error) && attempt < SEARCH_MAX_ATTEMPTS;

      if (!canRetry) {
        yield put(searchFailed(toSearchErrorMessage(error)));
        return;
      }

      yield delay(SEARCH_RETRY_DELAY_MS);
    }
  }
}

export function* watchSearch() {
  yield takeLatest(searchRequested.type, searchWorker);
}