
/**
 * @fileoverview Authentication state management using Zustand
 * @author Enterprise Development Team
 * @version 1.0.0
 * @compliance ISO/IEC 12207, CMMI Level 3+
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User, LoginRequest, LoadingState, UserRole, Permission } from '@/types';
import { login as apiLogin, logout as apiLogout } from '@/services/authService';
import { LoginResponse } from '@/types/auth';
import httpClient from '@/api/httpClient';

/**
 * Authentication store state interface
 * @interface AuthState
 */
interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loadingState: LoadingState;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

/**
 * Authentication store implementation
 * Handles user authentication state and operations
 * 
 * @example
 * ```typescript
 * const { login, logout, user, isAuthenticated } = useAuthStore();
 * 
 * // Login user
 * await login({ email: 'user@example.com', password: 'password' });
 * 
 * // Logout user
 * logout();
 * ```
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      loadingState: LoadingState.IDLE,
      error: null,

      /**
       * Authenticate user with credentials (bypassed for static credentials)
       * @param credentials - Login request payload
       * @throws {Error} When authentication fails
       */
      login: async (credentials: LoginRequest) => {
        try {
          set({ loadingState: LoadingState.LOADING, error: null });

          // Call actual API login
          const response: LoginResponse = await apiLogin(credentials);
          
          // Extract tokens and user from API response
          const { tokens, user: apiUser } = response;
          
          // Map API user to store User type
          const user: User = {
            id: apiUser.id,
            email: apiUser.email,
            firstName: apiUser.profile?.firstName || apiUser.email.split('@')[0],
            lastName: apiUser.profile?.lastName || '',
            department: apiUser.profile?.department || 'General',
            role: (apiUser.role as UserRole) || UserRole.USER,
            permissions: apiUser.profile?.permissions || [Permission.READ_DASHBOARD],
            isActive: true,
            createdAt: apiUser.profile?.createdAt ? new Date(apiUser.profile.createdAt) : new Date(),
            updatedAt: apiUser.profile?.updatedAt ? new Date(apiUser.profile.updatedAt) : new Date()
          };

          set({
            user,
            token: tokens.accessToken,
            isAuthenticated: true,
            loadingState: LoadingState.SUCCESS,
            error: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loadingState: LoadingState.ERROR,
            error: errorMessage
          });
          throw error;
        }
      },

      /**
       * Logout user and clear authentication state
       */
      logout: () => {
        // Remove token from localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiry');

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loadingState: LoadingState.IDLE,
          error: null
        });
      },

      /**
       * Refresh authentication token (mock implementation)
       * @throws {Error} When token refresh fails
       */
      refreshToken: async () => {
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // Mock refresh
          const newToken = 'mock-jwt-token-' + Date.now();
          localStorage.setItem('accessToken', newToken);
          localStorage.setItem('tokenExpiry', (Date.now() + (3600 * 1000)).toString());
          
          set({ token: newToken });
        } catch (error) {
          console.error('Token refresh error in store:', error);
          get().logout();
          throw error;
        }
      },

      /**
       * Clear error state
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Update user information
       * @param user - Updated user data
       */
      setUser: (user: User) => {
        set({ user });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

/**
 * Hook to get authentication status
 * @returns {boolean} Authentication status
 */
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);

/**
 * Hook to get current user
 * @returns {User | null} Current user or null
 */
export const useCurrentUser = () => useAuthStore(state => state.user);

/**
 * Hook to get authentication loading state
 * @returns {LoadingState} Current loading state
 */
export const useAuthLoading = () => useAuthStore(state => state.loadingState);
