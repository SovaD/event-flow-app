import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../api/apiConfig";

export const fetchInvite = createAsyncThunk(
  "invite/fetchInvite",
  async ({ eventId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/events/public/${eventId}/guest/${guestId}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Приглашение не найдено",
      );
    }
  },
);

export const submitRsvp = createAsyncThunk(
  "invite/submitRsvp",
  async ({ eventId, guestId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/events/public/${eventId}/guest/${guestId}/rsvp`,
        { status },
      );

      return { status, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка при сохранении ответа",
      );
    }
  },
);

const inviteSlice = createSlice({
  name: "invite",
  initialState: {
    data: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    replied: false,
    error: null,
  },
  reducers: {
    resetInvite: (state) => {
      state.data = null;
      state.status = "idle";
      state.replied = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvite.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInvite.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        if (
          action.payload.currentStatus === "Подтвержден" ||
          action.payload.currentStatus === "Отклонен"
        ) {
          state.replied = true;
        }
      })
      .addCase(fetchInvite.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(submitRsvp.fulfilled, (state, action) => {
        if (state.data) {
          state.data.currentStatus = action.payload.status;
        }
        state.replied = true;
      });
  },
});

export const { resetInvite } = inviteSlice.actions;
export default inviteSlice.reducer;
