import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore, persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer      from './AuthSlice';
import productsReducer  from './ProductsSlice';
import favoritesReducer from './FavoritesSlice';

// ─── Auth: persist token, isLoggedIn, user ────────────────────────────────────
const authPersistConfig = {
  key:       'auth',
  storage:   AsyncStorage,
  whitelist: ['token', 'isLoggedIn', 'user'],
};

// ─── Favorites: persist entire slice ─────────────────────────────────────────
const favoritesPersistConfig = {
  key:     'favorites',
  storage: AsyncStorage,
};

// ─── Products: never persisted (always fresh from API) ────────────────────────
const rootReducer = combineReducers({
  auth:      persistReducer(authPersistConfig,      authReducer),
  products:  productsReducer,
  favorites: persistReducer(favoritesPersistConfig, favoritesReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);