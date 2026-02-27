import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const product = action.payload;
      const index   = state.items.findIndex((p) => p.id === product.id);
      if (index !== -1) {
        state.items.splice(index, 1);   // already favourited → remove
      } else {
        state.items.push(product);      // not favourited → add
      }
    },
    removeFavorite: (state, action) => {
      // action.payload = product id
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { toggleFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;