import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { usersApi } from '../features/users/usersApi';
import { rolesApi } from '../features/roles/rolesApi';
import { supportApi } from '../features/support/supportApi';

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
    [supportApi.reducerPath]: supportApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>getDefaultMiddleware().concat(usersApi.middleware).concat(rolesApi.middleware).concat(supportApi.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
