import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from './rootSaga';
import { searchReducer } from './searchSlice';
import { watchlistReducer } from './watchlistSlice';
import { saveWatchlist } from '../utils/watchlistStorage';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    watchlist: watchlistReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

store.subscribe(() => {
  saveWatchlist(store.getState().watchlist.items);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;