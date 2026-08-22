import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Vehicle } from '../../types';
import { api } from '../../services/api';

interface VehicleState {
  items: Vehicle[];
  loading: boolean;
  error: string | null;
}

const initialState: VehicleState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchVehicles = createAsyncThunk('vehicles/fetchVehicles', async () => {
  return await api.getVehicles();
});

export const purchaseVehicle = createAsyncThunk('vehicles/purchaseVehicle', async (id: string) => {
  return await api.purchaseVehicle(id);
});

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch vehicles';
      })
      .addCase(purchaseVehicle.fulfilled, (state, action) => {
        const index = state.items.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default vehicleSlice.reducer;
