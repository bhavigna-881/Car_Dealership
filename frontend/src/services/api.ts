import type { Vehicle, User } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Helper to get auth headers
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // --- AUTHENTICATION ---
  register: async (userData: Omit<User, 'id' | 'role'> & { password?: string }): Promise<User> => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Registration failed');
    }
    return res.json();
  },

  login: async (credentials: any): Promise<{ user: User; token: string }> => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Login failed');
    }
    const data = await res.json();
    // Save token and user to localStorage automatically
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return {
      user: data.user,
      token: data.access_token,
    };
  },

  // --- VEHICLES ---
  getVehicles: async (): Promise<Vehicle[]> => {
    const res = await fetch(`${API_BASE_URL}/vehicles`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch vehicles');
    return res.json();
  },

  searchVehicles: async (params: { make?: string; maxPrice?: number }): Promise<Vehicle[]> => {
    const query = new URLSearchParams();
    if (params.make) query.append('make', params.make);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice.toString());
    
    const res = await fetch(`${API_BASE_URL}/vehicles/search?${query.toString()}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to search vehicles');
    return res.json();
  },
  
  addVehicle: async (vehicleData: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
    const res = await fetch(`${API_BASE_URL}/vehicles`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(vehicleData),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to add vehicle');
    }
    return res.json();
  },

  updateVehicle: async (id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
    const res = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(vehicleData),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to update vehicle');
    }
    return res.json();
  },

  deleteVehicle: async (id: string): Promise<string> => {
    const res = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to delete vehicle');
    }
    return id;
  },

  // --- INVENTORY ---
  purchaseVehicle: async (id: string): Promise<Vehicle> => {
    const res = await fetch(`${API_BASE_URL}/vehicles/${id}/purchase`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to purchase vehicle');
    }
    return res.json();
  },

  restockVehicle: async (id: string, amount: number = 1): Promise<Vehicle> => {
    const res = await fetch(`${API_BASE_URL}/vehicles/${id}/restock?amount=${amount}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to restock vehicle');
    }
    return res.json();
  },
};
