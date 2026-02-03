/**
 * @fileoverview Service Category type definitions
 * @author Enterprise Development Team
 * @version 1.0.0
 */

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategoryFormData {
  name: string;
  description?: string;
  sortOrder?: number;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFormData {
  categoryId: string;
  name: string;
  description?: string;
  isActive?: boolean;
}
