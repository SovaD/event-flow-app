import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Безопасное получение URL с защитой от "process is not defined"
const API_URL = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) 
  ? process.env.REACT_APP_API_URL 
  : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
    ? import.meta.env.VITE_API_URL
    : "http://localhost:5000/api";

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Ошибка авторизации");
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Ошибка регистрации");
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка логина
      .addCase(loginUser.pending, (state) => { 
        state.status = 'loading'; 
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        if (action.payload.token) {
           localStorage.setItem('token', action.payload.token);
        }
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Обработка регистрации
      .addCase(registerUser.pending, (state) => { 
        state.status = 'loading'; 
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        if (action.payload.token) {
           localStorage.setItem('token', action.payload.token);
        }
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;