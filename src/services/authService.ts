/**
 * @fileoverview Authentication service for API communication
 * @author Enterprise Development Team
 * @version 1.0.0
 * @compliance ISO/IEC 12207, CMMI Level 3+
 */

import httpClient from '@/api/httpClient';
import { LoginRequest } from '@/types/index';
import { LoginResponse } from '@/types/auth';

/**
 * Simple login function for API authentication
 * @param payload - Login credentials
 * @returns Promise resolving to login response
 * @throws {Error} When authentication fails
 */
export async function login(payload: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await httpClient.post('/auth/login', payload);
    
    // Store tokens for future requests
    if (response.data.tokens) {
      localStorage.setItem('accessToken', response.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
      localStorage.setItem('tokenExpiry', (Date.now() + (response.data.tokens.expiresIn * 1000)).toString());
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Handle specific API error responses
    if (error.response?.status === 401) {
      throw new Error('Invalid email or password');
    } else if (error.response?.status === 422) {
      throw new Error('Invalid request format');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error. Please check CORS settings on the server.');
    }
    
    throw new Error(error.message || 'Login failed');
  }
}

/**
 * Logout user and invalidate session
 * @returns Promise resolving when logout completes
 */
export async function logout(): Promise<void> {
  try {
    // Clear stored tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await httpClient.post('/auth/tokens/refresh', {
      refreshToken
    });

    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('tokenExpiry', (Date.now() + (response.data.expiresIn * 1000)).toString());
      return response.data.accessToken;
    }

    return null;
  } catch (error) {
    console.error('Token refresh error:', error);
    // Clear tokens on refresh failure
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
    return null;
  }
}

/**
 * Enhanced logout with token revocation
 * @param revokeAll - Whether to revoke all tokens or just current session
 */
export async function enhancedLogout(revokeAll: boolean = false): Promise<void> {
  try {
    // Revoke tokens on server
    if (revokeAll) {
      await httpClient.delete('/auth/tokens/revoke-all');
    } else {
      await httpClient.delete('/auth/tokens/revoke-session');
    }
  } catch (error) {
    console.warn('Token revocation failed:', error);
  } finally {
    // Always clear local tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
    console.log('User logged out successfully');
  }
}