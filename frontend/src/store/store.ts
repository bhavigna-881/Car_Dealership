import { configureStore } from '@reduxjs/toolkit';
import vehicleReducer from './slices/vehicleSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    vehicles: vehicleReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
