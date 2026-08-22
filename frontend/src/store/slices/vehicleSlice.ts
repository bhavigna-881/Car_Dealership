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

export const addVehicle = createAsyncThunk('vehicles/addVehicle', async (vehicle: Omit<Vehicle, 'id'>) => {
  return await api.addVehicle(vehicle);
});

export const updateVehicle = createAsyncThunk('vehicles/updateVehicle', async ({ id, data }: { id: string, data: Partial<Vehicle> }) => {
  return await api.updateVehicle(id, data);
});

export const deleteVehicle = createAsyncThunk('vehicles/deleteVehicle', async (id: string) => {
  return await api.deleteVehicle(id);
});

export const restockVehicle = createAsyncThunk('vehicles/restockVehicle', async ({ id, amount }: { id: string, amount?: number }) => {
  return await api.restockVehicle(id, amount);
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
      })
      .addCase(addVehicle.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        const index = state.items.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.items = state.items.filter(v => v.id !== action.payload);
      })
      .addCase(restockVehicle.fulfilled, (state, action) => {
        const index = state.items.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default vehicleSlice.reducer;
