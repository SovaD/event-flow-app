import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Безопасное получение URL с защитой от "process is not defined"
const API_URL = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) 
  ? process.env.REACT_APP_API_URL 
  : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
    ? import.meta.env.VITE_API_URL
    : "http://localhost:5000/api";

// Вспомогательная функция для получения токена
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// 1. Получение контактов
export const fetchContacts = createAsyncThunk('contacts/fetchContacts', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/contacts`, getAuthHeaders());
    return response.data;
  } catch (error) { 
    return rejectWithValue(error.response?.data || "Ошибка загрузки контактов"); 
  }
});

// 2. Добавление контакта
export const addContact = createAsyncThunk('contacts/addContact', async (newContact, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/contacts/add`, newContact, getAuthHeaders());
    return response.data;
  } catch (error) { 
    return rejectWithValue(error.response?.data || "Ошибка добавления контакта"); 
  }
});

// 3. Обновление контакта
export const updateContact = createAsyncThunk('contacts/updateContact', async ({ id, contactData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/contacts/${id}`, contactData, getAuthHeaders());
    return response.data; // Бэкенд должен вернуть обновленный контакт
  } catch (error) { 
    return rejectWithValue(error.response?.data || "Ошибка обновления контакта"); 
  }
});

// 4. Удаление контакта
export const deleteContact = createAsyncThunk('contacts/deleteContact', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/contacts/${id}`, getAuthHeaders());
    return id; // Возвращаем ID, чтобы удалить его из state
  } catch (error) { 
    return rejectWithValue(error.response?.data || "Ошибка удаления контакта"); 
  }
});

const contactSlice = createSlice({
  name: 'contacts',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchContacts.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add
      .addCase(addContact.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateContact.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload; // Заменяем старый контакт на новый
        }
      })
      // Delete
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c._id !== action.payload); // Убираем удаленный
      });
  }
});

export default contactSlice.reducer;