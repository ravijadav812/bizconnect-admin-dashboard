/**
 * @fileoverview Core TypeScript type definitions for the enterprise application
 * @author Enterprise Development Team
 * @version 1.0.0
 * @compliance ISO/IEC 12207, CMMI Level 3+
 */

// ============================================================================
// AUTH TYPES
// ============================================================================

/**
 * User authentication data structure
 * @interface User
 */
export interface User {
  id: string;
  email: string;
  displayName?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: Permission[];
  avatar?: string;
  isActive: boolean;
  department: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User role enumeration
 * @enum UserRole
 */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  VIEWER = 'viewer'
}

/**
 * Permission types for RBAC
 * @enum Permission
 */
export enum Permission {
  // New permissions
  CREATE_USER = 'create:user',
  EDIT_USER = 'edit:user',
  DELETE_USER = 'delete:user',
  VIEW_ANALYTICS = 'view:analytics',
  MANAGE_ROLES = 'manage:roles',
  SYSTEM_CONFIG = 'system:config',
  EXPORT_DATA = 'export:data',
  AUDIT_LOGS = 'audit:logs',
  
  // Legacy permissions
  READ_USERS = 'read:users',
  WRITE_USERS = 'write:users',
  DELETE_USERS = 'delete:users',
  READ_ROLES = 'read:roles',
  WRITE_ROLES = 'write:roles',
  DELETE_ROLES = 'delete:roles',
  READ_DASHBOARD = 'read:dashboard',
  WRITE_DASHBOARD = 'write:dashboard'
}

/**
 * Authentication request payload
 * @interface LoginRequest
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Authentication response payload
 * @interface LoginResponse
 */
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// ============================================================================
// API TYPES
// ============================================================================

/**
 * Standard API response wrapper
 * @interface ApiResponse
 */
export interface ApiResponse<T = any> {
  data: T;
  meta: ApiMeta;
  links: ApiLinks;
}

/**
 * API error structure
 * @interface ApiError
 */
export interface ApiError {
  message: string[];
  error: string;
  statusCode: number;
}

/**
 * API metadata for pagination
 * @interface ApiMeta
 */
export interface ApiMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  sortBy: string;
  sortOrder: string;
}

/**
 * Links for paginated API responses
 * @interface ApiLinks
 */
export interface ApiLinks {
  first: string;
  last: string;
  next?: string;
  prev?: string;
}

/**
 * Pagination parameters
 * @interface PaginationParams
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
  createdAfter?: string;
  createdBefore?: string;
  isActive?: boolean;
  role?: string;
  onboardingStatus?: string;
  region?: string;
  emailVerified?: boolean;
  businessHelpOption?: string;
}

// ============================================================================
// ROLE MANAGEMENT TYPES
// ============================================================================

/**
 * Role data structure
 * @interface Role
 */
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Role creation/update payload
 * @interface RoleFormData
 */
export interface RoleFormData {
  name: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

/**
 * Dashboard KPI data structure
 * @interface KpiData
 */
export interface KpiData {
  title: string;
  value: number;
  previousValue?: number;
  trend: 'up' | 'down' | 'stable';
  format: 'number' | 'currency' | 'percentage';
  icon: string;
}

/**
 * Chart data point
 * @interface ChartDataPoint
 */
export interface ChartDataPoint {
  name: string;
  value: number;
  date?: string;
}

/**
 * Chart configuration
 * @interface ChartConfig
 */
export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area';
  data: ChartDataPoint[];
  title: string;
  xAxisKey: string;
  yAxisKey: string;
  colors?: string[];
}

// ============================================================================
// FORM TYPES
// ============================================================================

/**
 * User form data for creation/editing
 * @interface UserFormData
 */
export interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  department: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  password?: string;
}

/**
 * Form validation error structure
 * @interface FormError
 */
export interface FormError {
  field: string;
  message: string;
}

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

/**
 * Navigation menu item
 * @interface NavItem
 */
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  permission?: Permission;
  children?: NavItem[];
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Loading state enumeration
 * @enum LoadingState
 */
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

/**
 * Generic entity with common fields
 * @interface BaseEntity
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Filter options for lists
 * @interface FilterOptions
 */
export interface FilterOptions {
  status?: 'active' | 'inactive' | 'all';
  role?: UserRole | 'all';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Table column configuration
 * @interface TableColumn
 */
export interface TableColumn<T = any> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, record: T) => React.ReactNode;
}

/**
 * Theme configuration
 * @interface ThemeConfig
 */
export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  borderRadius: number;
}