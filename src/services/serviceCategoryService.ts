/**
 * @fileoverview Service Category management service for CRUD operations
 * @author Enterprise Development Team
 * @version 1.0.0
 * @compliance ISO/IEC 12207, CMMI Level 3+
 */

import { ServiceCategory, ServiceCategoryFormData, Service, ServiceFormData } from '@/types/category';
import { ApiResponse } from '@/types';
import httpClient from '@/api/httpClient';

/**
 * Service Category management service class
 * Handles all category-related CRUD operations
 */
class ServiceCategoryService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/admin/service-categories';
  }

  /**
   * Initialize all 37 official categories
   * @returns Promise resolving to initialization response
   */
  async initialize(): Promise<ApiResponse<any>> {
    try {
      const response = await httpClient.post(`${this.baseUrl}/initialize`);
      return response.data;
    } catch (error) {
      console.error('Error initializing categories:', error);
      throw error;
    }
  }

  /**
   * Get list of official category names
   * @returns Promise resolving to list of category names
   */
  async getOfficialList(): Promise<ApiResponse<string[]>> {
    try {
      const response = await httpClient.get(`${this.baseUrl}/official-list`);
      return response.data;
    } catch (error) {
      console.error('Error fetching official categories:', error);
      throw error;
    }
  }

  /**
   * Get all categories
   * @param params - Filter parameters
   * @returns Promise resolving to category list
   */
  async getAll(params?: { search?: string; isActive?: boolean }): Promise<ApiResponse<ServiceCategory[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

      const url = `${this.baseUrl}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await httpClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Get category by ID
   * @param id - Category ID
   * @returns Promise resolving to category data
   */
  async getById(id: string): Promise<ApiResponse<ServiceCategory>> {
    try {
      const response = await httpClient.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  /**
   * Create new category
   * @param categoryData - Category creation data
   * @returns Promise resolving to created category
   */
  async create(categoryData: ServiceCategoryFormData): Promise<ApiResponse<ServiceCategory>> {
    try {
      const response = await httpClient.post(this.baseUrl, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  /**
   * Update existing category
   * @param id - Category ID
   * @param categoryData - Updated category data
   * @returns Promise resolving to updated category
   */
  async update(id: string, categoryData: Partial<ServiceCategoryFormData>): Promise<ApiResponse<ServiceCategory>> {
    try {
      const response = await httpClient.patch(`${this.baseUrl}/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  /**
   * Delete category by ID
   * @param id - Category ID
   * @returns Promise resolving when deletion completes
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await httpClient.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Service-related methods
  private servicesUrl = '/admin/services';

  /**
   * Get all services
   * @param params - Filter parameters
   * @returns Promise resolving to service list
   */
  async getAllServices(params?: { categoryId?: string; search?: string }): Promise<ApiResponse<Service[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
      if (params?.search) queryParams.append('search', params.search);

      const url = `${this.servicesUrl}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await httpClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  }

  /**
   * Get service by ID
   * @param id - Service ID
   * @returns Promise resolving to service data
   */
  async getServiceById(id: string): Promise<ApiResponse<Service>> {
    try {
      const response = await httpClient.get(`${this.servicesUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching service:', error);
      throw error;
    }
  }

  /**
   * Create new service
   * @param serviceData - Service creation data
   * @returns Promise resolving to created service
   */
  async createService(serviceData: ServiceFormData): Promise<ApiResponse<Service>> {
    try {
      const response = await httpClient.post(this.servicesUrl, serviceData);
      return response.data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  }

  /**
   * Update existing service
   * @param id - Service ID
   * @param serviceData - Updated service data
   * @returns Promise resolving to updated service
   */
  async updateService(id: string, serviceData: Partial<ServiceFormData>): Promise<ApiResponse<Service>> {
    try {
      const response = await httpClient.patch(`${this.servicesUrl}/${id}`, serviceData);
      return response.data;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  }

  /**
   * Delete service by ID
   * @param id - Service ID
   * @returns Promise resolving when deletion completes
   */
  async deleteService(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await httpClient.delete(`${this.servicesUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }
}

export const serviceCategoryService = new ServiceCategoryService();
