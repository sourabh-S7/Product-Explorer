import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ─── Async thunk ──────────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await fetch('https://dummyjson.com/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, expiresInMins: 1440 }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data?.message ?? 'Invalid username or password');
      return data;
    } catch {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token:      null,
    user:       null,
    isLoggedIn: false,
    loading:    false,
    error:      '',
  },
  reducers: {
    logout: (state) => {
      state.token      = null;
      state.user       = null;
      state.isLoggedIn = false;
      state.error      = '';
      state.loading    = false;
    },
    clearAuthError: (state) => {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error   = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading    = false;
        state.token      = action.payload.accessToken;
        state.isLoggedIn = true;
        state.user = {
          id:        action.payload.id,
          username:  action.payload.username,
          email:     action.payload.email,
          firstName: action.payload.firstName,
          lastName:  action.payload.lastName,
          image:     action.payload.image,
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;