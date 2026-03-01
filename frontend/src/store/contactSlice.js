import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../api/apiConfig";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/contacts`, getAuthHeaders());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Ошибка загрузки контактов",
      );
    }
  },
);
export const addContact = createAsyncThunk(
  "contacts/addContact",
  async (newContact, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/contacts/add`,
        newContact,
        getAuthHeaders(),
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Ошибка добавления контакта",
      );
    }
  },
);

export const updateContact = createAsyncThunk(
  "contacts/updateContact",
  async ({ id, contactData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/contacts/${id}`,
        contactData,
        getAuthHeaders(),
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Ошибка обновления контакта",
      );
    }
  },
);
export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/contacts/${id}`, getAuthHeaders());
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Ошибка удаления контакта",
      );
    }
  },
);

const contactSlice = createSlice({
  name: "contacts",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Add
      .addCase(addContact.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateContact.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (c) => c._id === action.payload._id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);
      });
  },
});

export default contactSlice.reducer;
