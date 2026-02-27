import { configureStore } from '@reduxjs/toolkit';
import authReducer      from './AuthSlice';
import productsReducer  from './ProductsSlice';
import favoritesReducer from './FavoritesSlice';

export const store = configureStore({
  reducer: {
    auth:      authReducer,
    products:  productsReducer,
    favorites: favoritesReducer,
  },
});