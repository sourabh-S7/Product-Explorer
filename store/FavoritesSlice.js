import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveFavorites = (items) => {
  try {
    AsyncStorage.setItem('favorites', JSON.stringify(items));
  } catch (e) {
    console.warn('Could not save favorites:', e);
  }
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { items: [] },
  reducers: {
    toggleFavorite: (state, action) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.items.splice(index, 1);
      else              state.items.push(action.payload);
      saveFavorites(state.items);
    },
    removeFavorite: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
      saveFavorites(state.items);
    },
    clearFavorites: (state) => {
      state.items = [];
      saveFavorites([]);
    },
    setFavorites: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { toggleFavorite, removeFavorite, clearFavorites, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;