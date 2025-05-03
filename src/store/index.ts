import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { domainApi } from '../services/api';
import domainsReducer from './domainsSlice';

export const store = configureStore({
  reducer: {
    [domainApi.reducerPath]: domainApi.reducer,
    domains: domainsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(domainApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 