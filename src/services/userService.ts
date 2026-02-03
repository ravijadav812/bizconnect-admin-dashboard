/**
 * @fileoverview User management service for CRUD operations
 * @author Enterprise Development Team
 * @version 1.0.0
 * @compliance ISO/IEC 12207, CMMI Level 3+
 */

import { User, UserFormData, ApiResponse, PaginationParams, UserRole } from '@/types';
import httpClient from '@/api/httpClient';

/**
 * User management service class
 * Handles all user-related CRUD operations
 * 
 * @class UserService
 */
class UserService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/admin/users';
  }

  /**
   * Fetch paginated list of users
   * @param params - Pagination and filter parameters
   * @returns Promise resolving to paginated user list
   */
  async getAll(params: PaginationParams = {}): Promise<ApiResponse<User[]>> {
    try {
      // Build query parameters - admin endpoint doesn't support sortBy/sortOrder
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.createdAfter) queryParams.append('createdAfter', params.createdAfter);
      if (params.createdBefore) queryParams.append('createdBefore', params.createdBefore);
      if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
      if (params.role) queryParams.append('role', params.role);
      if (params.onboardingStatus) queryParams.append('onboardingStatus', params.onboardingStatus);
      if (params.region) queryParams.append('region', params.region);
      if (params.emailVerified !== undefined) queryParams.append('emailVerified', params.emailVerified.toString());
      if (params.businessHelpOption) queryParams.append('businessHelpOption', params.businessHelpOption);

      const url = `${this.baseUrl}?${queryParams.toString()}`;
      console.log('Fetching users from URL:', url);
      
      const response = await httpClient.get(url);
      console.log('Users fetch response:', response.data);
      
      // Apply frontend sorting since API doesn't support it
      let sortedUsers = response.data.users || [];
      if (params.sortBy && params.sortOrder) {
        sortedUsers = [...sortedUsers].sort((a, b) => {
          const aValue = a[params.sortBy!];
          const bValue = b[params.sortBy!];
          
          let comparison = 0;
          if (aValue < bValue) comparison = -1;
          if (aValue > bValue) comparison = 1;
          
          return params.sortOrder === 'DESC' ? -comparison : comparison;
        });
      }
      
      // Transform response to match expected structure
      return {
        data: sortedUsers,
        meta: {
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          totalCount: response.data.pagination.totalCount,
          totalPages: response.data.pagination.totalPages,
          hasNext: response.data.pagination.hasNext,
          hasPrev: response.data.pagination.hasPrev,
          sortBy: params.sortBy || 'createdAt',
          sortOrder: params.sortOrder || 'DESC'
        },
        links: {
          first: '',
          last: '',
          prev: '',
          next: ''
        }
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param id - User ID
   * @returns Promise resolving to user data
   */
  async getById(id: string): Promise<ApiResponse<User>> {
    try {
      console.log('UserService.getById called with ID:', id);
      const url = `${this.baseUrl}/${id}`;
      console.log('Making GET request to:', url);
      
      const response = await httpClient.get(url);
      console.log('Raw API response:', response);
      console.log('Response data:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user in service:', error);
      throw error;
    }
  }

  /**
   * Create new user
   * @param userData - User creation data
   * @returns Promise resolving to created user
   */
  async create(userData: { email: string; password: string; role: string }): Promise<ApiResponse<User>> {
    try {
      console.log('Creating user with payload:', JSON.stringify(userData, null, 2));
      
      const response = await httpClient.post(this.baseUrl, userData);
      console.log('User creation response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update existing user
   * @param id - User ID
   * @param userData - Updated user data
   * @returns Promise resolving to updated user
   */
  async update(id: string, userData: Partial<UserFormData>): Promise<ApiResponse<User>> {
    try {
      const response = await httpClient.put(`${this.baseUrl}/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user by ID
   * @param id - User ID
   * @returns Promise resolving when deletion completes
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await httpClient.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Bulk delete users
   * @param ids - Array of user IDs
   * @returns Promise resolving when bulk deletion completes
   */
  async bulkDelete(ids: string[]): Promise<ApiResponse<null>> {
    try {
      const response = await httpClient.delete(`${this.baseUrl}/bulk`, { data: { ids } });
      return response.data;
    } catch (error) {
      console.error('Error bulk deleting users:', error);
      throw error;
    }
  }

  /**
   * Update user status (active/inactive)
   * @param id - User ID
   * @param isActive - New status
   * @returns Promise resolving to updated user
   */
  async updateStatus(id: string, isActive: boolean): Promise<ApiResponse<User>> {
    try {
      const response = await httpClient.patch(`${this.baseUrl}/${id}/status`, { isActive });
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  /**
   * Activate user account
   * @param id - User ID
   * @returns Promise resolving to updated user
   */
  async activate(id: string): Promise<ApiResponse<User>> {
    try {
      const response = await httpClient.put(`${this.baseUrl}/${id}/activate`);
      return response.data;
    } catch (error) {
      console.error('Error activating user:', error);
      throw error;
    }
  }

  /**
   * Deactivate user account
   * @param id - User ID
   * @returns Promise resolving to updated user
   */
  async deactivate(id: string): Promise<ApiResponse<User>> {
    try {
      const response = await httpClient.put(`${this.baseUrl}/${id}/deactivate`);
      return response.data;
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }
}

export const userService = new UserService();