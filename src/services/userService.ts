/**
 * @fileoverview User service for API calls
 * @author Enterprise Development Team
 * @version 1.0.0
 */

import httpClient from '@/api/httpClient';

export interface User {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
}

interface GetAllParams {
  search?: string;
  page?: number;
  limit?: number;
  role?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const userService = {
  /**
   * Get all users with optional filtering
   */
  getAll: async (params?: GetAllParams): Promise<PaginatedResponse<User>> => {
    const response = await httpClient.get('/users', { params });
    return response.data;
  },

  /**
   * Get a single user by ID
   */
  getById: async (id: string): Promise<User> => {
    const response = await httpClient.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Create a new user
   */
  create: async (data: CreateUserData): Promise<User> => {
    const response = await httpClient.post('/users', data);
    return response.data;
  },

  /**
   * Update an existing user
   */
  update: async (id: string, data: UpdateUserData): Promise<User> => {
    const response = await httpClient.put(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete a user
   */
  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/users/${id}`);
  },

  /**
   * Toggle user active status
   */
  toggleStatus: async (id: string): Promise<User> => {
    const response = await httpClient.patch(`/users/${id}/toggle-status`);
    return response.data;
  },
};
