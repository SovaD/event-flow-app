import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Безопасное получение URL с защитой от "process is not defined"
const API_URL = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) 
  ? process.env.REACT_APP_API_URL 
  : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
    ? import.meta.env.VITE_API_URL
    : "http://localhost:5000/api";

// Асинхронное действие (Thunk) для получения мероприятий с сервера
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      // Если токен обязателен, передаем его в заголовках
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const response = await axios.get(`${API_URL}/events`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Ошибка загрузки событий");
    }
  }
);

const eventSlice = createSlice({
  name: 'events',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // Сохраняем загруженные события в store
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default eventSlice.reducer;