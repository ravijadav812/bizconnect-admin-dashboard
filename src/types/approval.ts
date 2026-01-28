/**
 * @fileoverview Approval management type definitions
 * @author Enterprise Development Team
 * @version 1.0.0
 */

export interface ServiceProviderProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  region: string;
  mobileNumber: string;
  businessName: string;
  businessDescription: string;
  businessLogo: string | null;
  nzbnNumber: string;
  nzbnApprovalStatus: 'pending' | 'approved' | 'rejected';
  nzbnApprovalReason: string | null;
  nzbnApprovedBy: string | null;
  nzbnApprovedAt: string | null;
  businessHelpOptions: string[];
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PendingApprovalUser {
  id: string;
  email: string;
  role: string;
  onboardingStatus: string;
  isActive: boolean;
  avatar: string | null;
  lastLoginAt: string | null;
  emailVerified: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  serviceProviderProfile: ServiceProviderProfile;
}

export interface ApprovalParams {
  page?: number;
  limit?: number;
  role?: string;
  onboardingStatus?: string;
  isActive?: boolean;
  search?: string;
  region?: string;
  nzbnApprovalStatus?: string;
}