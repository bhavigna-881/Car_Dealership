import type { Vehicle } from '../types';

// Mock initial data
let mockVehicles: Vehicle[] = [
  { id: '1', make: 'Toyota', model: 'Camry', category: 'Sedan', price: 24000, quantity: 5 },
  { id: '2', make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 3 },
  { id: '3', make: 'Ford', model: 'F-150', category: 'Truck', price: 35000, quantity: 0 },
  { id: '4', make: 'Tesla', model: 'Model 3', category: 'Electric', price: 40000, quantity: 2 },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getVehicles: async (): Promise<Vehicle[]> => {
    await delay(500);
    return [...mockVehicles];
  },
  
  purchaseVehicle: async (id: string): Promise<Vehicle> => {
    await delay(500);
    const vehicle = mockVehicles.find(v => v.id === id);
    if (!vehicle) throw new Error('Vehicle not found');
    if (vehicle.quantity <= 0) throw new Error('Out of stock');
    
    vehicle.quantity -= 1;
    return { ...vehicle };
  },

  restockVehicle: async (id: string, amount: number = 1): Promise<Vehicle> => {
    await delay(500);
    const vehicle = mockVehicles.find(v => v.id === id);
    if (!vehicle) throw new Error('Vehicle not found');
    
    vehicle.quantity += amount;
    return { ...vehicle };
  },

  addVehicle: async (vehicleData: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
    await delay(500);
    const newVehicle = {
      ...vehicleData,
      id: Math.random().toString(36).substr(2, 9),
    };
    mockVehicles.push(newVehicle);
    return { ...newVehicle };
  },

  updateVehicle: async (id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
    await delay(500);
    const index = mockVehicles.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Vehicle not found');
    
    mockVehicles[index] = { ...mockVehicles[index], ...vehicleData };
    return { ...mockVehicles[index] };
  },

  deleteVehicle: async (id: string): Promise<string> => {
    await delay(500);
    mockVehicles = mockVehicles.filter(v => v.id !== id);
    return id;
  }
};
