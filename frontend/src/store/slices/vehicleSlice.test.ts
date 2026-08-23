import { describe, it, expect } from 'vitest';
import vehicleReducer, { fetchVehicles, purchaseVehicle, addVehicle, updateVehicle, deleteVehicle, restockVehicle } from './vehicleSlice';
import { Vehicle } from '../../types';

describe('vehicleSlice', () => {
  const initialState = {
    items: [] as Vehicle[],
    loading: false,
    error: null,
  };

  const mockVehicle: Vehicle = {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 25000,
    quantity: 5,
  };

  it('should handle initial state', () => {
    expect(vehicleReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchVehicles.pending', () => {
    const action = { type: fetchVehicles.pending.type };
    const state = vehicleReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchVehicles.fulfilled', () => {
    const action = { type: fetchVehicles.fulfilled.type, payload: [mockVehicle] };
    const state = vehicleReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.items).toEqual([mockVehicle]);
  });

  it('should handle fetchVehicles.rejected', () => {
    const action = { type: fetchVehicles.rejected.type, error: { message: 'Network Error' } };
    const state = vehicleReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network Error');
  });

  it('should handle purchaseVehicle.fulfilled', () => {
    const stateWithVehicle = {
      items: [mockVehicle],
      loading: false,
      error: null,
    };
    const updatedVehicle = { ...mockVehicle, quantity: 4 };
    const action = { type: purchaseVehicle.fulfilled.type, payload: updatedVehicle };
    const state = vehicleReducer(stateWithVehicle, action);
    
    expect(state.items[0].quantity).toBe(4);
  });

  it('should handle addVehicle.fulfilled', () => {
    const action = { type: addVehicle.fulfilled.type, payload: mockVehicle };
    const state = vehicleReducer(initialState, action);
    expect(state.items.length).toBe(1);
    expect(state.items[0]).toEqual(mockVehicle);
  });

  it('should handle updateVehicle.fulfilled', () => {
    const stateWithVehicle = {
      items: [mockVehicle],
      loading: false,
      error: null,
    };
    const updatedVehicle = { ...mockVehicle, price: 26000 };
    const action = { type: updateVehicle.fulfilled.type, payload: updatedVehicle };
    const state = vehicleReducer(stateWithVehicle, action);
    
    expect(state.items[0].price).toBe(26000);
  });

  it('should handle deleteVehicle.fulfilled', () => {
    const stateWithVehicle = {
      items: [mockVehicle],
      loading: false,
      error: null,
    };
    const action = { type: deleteVehicle.fulfilled.type, payload: '1' };
    const state = vehicleReducer(stateWithVehicle, action);
    
    expect(state.items.length).toBe(0);
  });

  it('should handle restockVehicle.fulfilled', () => {
    const stateWithVehicle = {
      items: [mockVehicle],
      loading: false,
      error: null,
    };
    const updatedVehicle = { ...mockVehicle, quantity: 10 };
    const action = { type: restockVehicle.fulfilled.type, payload: updatedVehicle };
    const state = vehicleReducer(stateWithVehicle, action);
    
    expect(state.items[0].quantity).toBe(10);
  });
});
