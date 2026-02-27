import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function applyFilters(items, query, category) {
  return items.filter((p) => {
    const matchesQuery    = p.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesQuery && matchesCategory;
  });
}

// ─── Async thunk ──────────────────────────────────────────────────────────────
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('https://fakestoreapi.com/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message ?? 'Something went wrong');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items:            [],
    filteredItems:    [],
    loading:          false,
    error:            '',
    searchQuery:      '',
    selectedCategory: 'All',
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery   = action.payload;
      state.filteredItems = applyFilters(state.items, action.payload, state.selectedCategory);
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.filteredItems    = applyFilters(state.items, state.searchQuery, action.payload);
    },
    resetFilters: (state) => {
      state.searchQuery      = '';
      state.selectedCategory = 'All';
      state.filteredItems    = state.items;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error   = '';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading       = false;
        state.items         = action.payload;
        state.filteredItems = applyFilters(
          action.payload,
          state.searchQuery,
          state.selectedCategory
        );
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });
  },
});

export const { setSearchQuery, setSelectedCategory, resetFilters } = productsSlice.actions;
export default productsSlice.reducer;