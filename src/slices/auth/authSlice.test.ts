import { describe, it, expect, vi, beforeEach } from 'vitest';
import authReducer, { setAuthUser, logout } from './authSlice';
import type { AuthState, User } from './authTypes';

describe('authSlice', () => {
  const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  });

  it('should handle setAuthUser', () => {
    const user: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    };
    const token = 'fake-jwt-token';

    const action = setAuthUser({ user, token });
    const state = authReducer(initialState, action);

    expect(state.user).toEqual(user);
    expect(state.token).toBe(token);
    expect(state.isAuthenticated).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle logout', () => {
    const loggedInState: AuthState = {
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
      token: 'fake-token',
      isAuthenticated: true,
      loading: false,
      error: null,
    };

    const state = authReducer(loggedInState, logout());

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBeNull();
  });
});
