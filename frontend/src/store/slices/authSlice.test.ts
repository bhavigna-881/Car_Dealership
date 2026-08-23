import { describe, it, expect } from 'vitest';
import authReducer, { login, logout } from './authSlice';

describe('authSlice', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    token: null,
  };

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle login', () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@test.com', mobile: '1234567890', role: 'customer' as const };
    const action = login({ user: mockUser, token: 'mock-token' });
    const state = authReducer(initialState, action);
    
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('mock-token');
  });

  it('should handle logout', () => {
    const loggedInState = {
      user: { id: '1', name: 'Test User', email: 'test@test.com', mobile: '1234567890', role: 'customer' as const },
      isAuthenticated: true,
      token: 'mock-token',
    };
    const action = logout();
    const state = authReducer(loggedInState, action);
    
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});
