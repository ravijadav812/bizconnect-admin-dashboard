/**
 * @fileoverview Approval management service
 * @author Enterprise Development Team
 * @version 1.0.0
 */

import httpClient from '@/api/httpClient';
import { ApiResponse } from '@/types';
import { PendingApprovalUser, ApprovalParams } from '@/types/approval';

class ApprovalService {
  /**
   * Get pending NZBN approvals (fetch all statuses, not just pending)
   */
  async getPendingApprovals(params: ApprovalParams = {}): Promise<ApiResponse<PendingApprovalUser[]>> {
    const queryParams = new URLSearchParams();
    
    // Add pagination parameters
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    // Add filter parameters
    if (params.role) queryParams.append('role', params.role);
    if (params.onboardingStatus) queryParams.append('onboardingStatus', params.onboardingStatus);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.region) queryParams.append('region', params.region);
    
    // Remove the hardcoded nzbnApprovalStatus filter to show all statuses
    // if (params.nzbnApprovalStatus) queryParams.append('nzbnApprovalStatus', params.nzbnApprovalStatus);

    const url = `/admin/users/nzbn-approvals/pending${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('ApprovalService: Fetching from URL:', url);
    const response = await httpClient.get(url);
    console.log('ApprovalService: Response received:', response.data);
    return response.data;
  }

  /**
   * Approve or reject a user's NZBN
   */
  async updateNzbnApproval(userId: string, status: 'approved' | 'rejected', reason?: string): Promise<ApiResponse<any>> {
    const requestBody: { status: string; reason?: string } = { status };
    
    if (reason) {
      requestBody.reason = reason;
    }
    
    const response = await httpClient.put(`/admin/users/${userId}/nzbn-approval`, requestBody);
    return response.data;
  }

  /**
   * Approve a user's NZBN
   */
  async approveUser(userId: string, reason: string = "NZBN verified successfully"): Promise<ApiResponse<any>> {
    return this.updateNzbnApproval(userId, 'approved', reason);
  }

  /**
   * Reject a user's NZBN with remarks
   */
  async rejectUser(userId: string, reason: string): Promise<ApiResponse<any>> {
    return this.updateNzbnApproval(userId, 'rejected', reason);
  }

  /**
   * Get NZBN approval history
   */
  async getApprovalHistory(params: ApprovalParams = {}): Promise<ApiResponse<PendingApprovalUser[]>> {
    const queryParams = new URLSearchParams();
    
    console.log('ApprovalService getApprovalHistory: Received params:', params);
    
    // Add pagination parameters
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    // Add filter parameters - only if they have values
    if (params.role && params.role.trim()) queryParams.append('role', params.role);
    if (params.onboardingStatus && params.onboardingStatus.trim()) queryParams.append('onboardingStatus', params.onboardingStatus);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params.search && params.search.trim()) queryParams.append('search', params.search);
    if (params.region && params.region.trim()) queryParams.append('region', params.region);
    if (params.nzbnApprovalStatus && params.nzbnApprovalStatus.trim()) queryParams.append('nzbnApprovalStatus', params.nzbnApprovalStatus);

    const url = `/admin/users/nzbn-approvals/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('ApprovalService: Fetching history from URL:', url);
    const response = await httpClient.get(url);
    console.log('ApprovalService: History response received:', response.data);
    return response.data;
  }
}

export const approvalService = new ApprovalService();