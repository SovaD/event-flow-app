import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "./eventSlice";
import contactReducer from "./contactSlice"; 
import authReducer from "./authSlice";  
import inviteReducer from './inviteSlice';


export const store = configureStore({
  reducer: {
    events: eventReducer,
    contacts: contactReducer,
    auth: authReducer,
    invite: inviteReducer,
  },
});
