import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveToStorage = async (token, user) => {
  try {
    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('auth_user', JSON.stringify(user));
  } catch (e) {
    console.warn('Could not save auth to storage:', e);
  }
};

const clearStorage = async () => {
  try {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('auth_user');
  } catch (e) {
    console.warn('Could not clear auth from storage:', e);
  }
};

// ─── Async thunk: Login ───────────────────────────────────────────────────────
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

      // Save to storage separately — won't crash login if it fails
      const user = {
        id:        data.id,
        username:  data.username,
        email:     data.email,
        firstName: data.firstName,
        lastName:  data.lastName,
        image:     data.image,
      };
      await saveToStorage(data.accessToken, user);

      return data;
    } catch (err) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

// ─── Async thunk: Restore session on app start ────────────────────────────────
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async () => {
    try {
      const token   = await AsyncStorage.getItem('auth_token');
      const userStr = await AsyncStorage.getItem('auth_user');
      if (!token || !userStr) return null;
      return { token, user: JSON.parse(userStr) };
    } catch (e) {
      console.warn('Could not restore session:', e);
      return null;
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
    hydrated:   false,
    error:      '',
  },
  reducers: {
    logout: (state) => {
      state.token      = null;
      state.user       = null;
      state.isLoggedIn = false;
      state.error      = '';
      state.loading    = false;
      clearStorage();
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
        state.isLoggedIn = true;
        state.token      = action.payload.accessToken;
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
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.hydrated = true;
        if (action.payload) {
          state.token      = action.payload.token;
          state.user       = action.payload.user;
          state.isLoggedIn = true;
        }
      })
      .addCase(restoreSession.rejected, (state) => {
        state.hydrated = true;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;