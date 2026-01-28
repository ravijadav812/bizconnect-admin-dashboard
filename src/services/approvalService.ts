/**
 * @fileoverview Approval service for API calls
 * @author Enterprise Development Team
 * @version 1.0.0
 */

import httpClient from '@/api/httpClient';
import { PendingApprovalUser, ApprovalParams } from '@/types/approval';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApprovalHistoryItem {
  id: string;
  userId: string;
  action: 'approved' | 'rejected';
  reason: string | null;
  approvedBy: string;
  approvedAt: string;
  user: {
    email: string;
    serviceProviderProfile?: {
      businessName: string;
      nzbnNumber: string;
    };
  };
}

export const approvalService = {
  /**
   * Get pending approvals
   */
  getPendingApprovals: async (params?: ApprovalParams): Promise<PaginatedResponse<PendingApprovalUser>> => {
    const response = await httpClient.get('/approvals/pending', { params });
    return response.data;
  },

  /**
   * Get approval history
   */
  getApprovalHistory: async (params?: ApprovalParams): Promise<PaginatedResponse<ApprovalHistoryItem>> => {
    const response = await httpClient.get('/approvals/history', { params });
    return response.data;
  },

  /**
   * Approve a user's NZBN
   */
  approveNzbn: async (userId: string): Promise<void> => {
    await httpClient.post(`/approvals/${userId}/approve`);
  },

  /**
   * Reject a user's NZBN
   */
  rejectNzbn: async (userId: string, reason: string): Promise<void> => {
    await httpClient.post(`/approvals/${userId}/reject`, { reason });
  },

  /**
   * Get approval statistics
   */
  getStatistics: async (): Promise<{
    pending: number;
    approved: number;
    rejected: number;
  }> => {
    const response = await httpClient.get('/approvals/statistics');
    return response.data;
  },
};
