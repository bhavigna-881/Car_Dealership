export interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  role: 'customer' | 'admin';
}
