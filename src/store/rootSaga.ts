import { all } from 'redux-saga/effects';
import { watchSearch } from './searchSaga';

export function* rootSaga() {
  yield all([watchSearch()]);
}