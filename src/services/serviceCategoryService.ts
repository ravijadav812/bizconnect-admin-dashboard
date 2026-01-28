/**
 * @fileoverview Service category API service
 * @author Enterprise Development Team
 * @version 1.0.0
 */

import httpClient from '@/api/httpClient';
import { ServiceCategory, ServiceCategoryFormData } from '@/types/category';

interface GetAllParams {
  search?: string;
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const serviceCategoryService = {
  /**
   * Get all service categories with optional filtering
   */
  getAll: async (params?: GetAllParams): Promise<PaginatedResponse<ServiceCategory>> => {
    const response = await httpClient.get('/categories', { params });
    return response.data;
  },

  /**
   * Get a single service category by ID
   */
  getById: async (id: string): Promise<ServiceCategory> => {
    const response = await httpClient.get(`/categories/${id}`);
    return response.data;
  },

  /**
   * Create a new service category
   */
  create: async (data: ServiceCategoryFormData): Promise<ServiceCategory> => {
    const response = await httpClient.post('/categories', data);
    return response.data;
  },

  /**
   * Update an existing service category
   */
  update: async (id: string, data: ServiceCategoryFormData): Promise<ServiceCategory> => {
    const response = await httpClient.put(`/categories/${id}`, data);
    return response.data;
  },

  /**
   * Delete a service category
   */
  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/categories/${id}`);
  },

  /**
   * Initialize official categories
   */
  initialize: async (): Promise<void> => {
    await httpClient.post('/categories/initialize');
  },

  /**
   * Export categories to CSV
   */
  exportToCsv: async (): Promise<Blob> => {
    const response = await httpClient.get('/categories/export', {
      responseType: 'blob',
    });
    return response.data;
  },
};
