/**
 * @fileoverview Authentication service for API calls
 * @author Enterprise Development Team
 * @version 1.0.0
 */

import httpClient from '@/api/httpClient';
import { LoginRequest } from '@/types';
import { LoginResponse } from '@/types/auth';

/**
 * Login user with credentials
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await httpClient.post('/auth/login', credentials);
  return response.data;
};

/**
 * Logout the current user
 */
export const logout = async (): Promise<void> => {
  await httpClient.post('/auth/logout');
};

/**
 * Refresh the authentication token
 */
export const refreshToken = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
  const response = await httpClient.post('/auth/refresh', { refreshToken });
  return response.data;
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<LoginResponse['user']> => {
  const response = await httpClient.get('/auth/me');
  return response.data;
};
