/**
 * @fileoverview Job limits service for API calls
 * @author Enterprise Development Team
 * @version 1.0.0
 */

import httpClient from '@/api/httpClient';

export interface JobLimits {
  maxApplications: number;
  maxInvitations: number;
}

/**
 * Fetch current job limits
 */
export const getJobLimits = async (): Promise<JobLimits> => {
  const response = await httpClient.get('/settings/job-limits');
  return response.data;
};

/**
 * Update max applications limit
 */
export const updateMaxApplications = async (maxApplications: number): Promise<void> => {
  await httpClient.put('/settings/max-applications', { maxApplications });
};

/**
 * Update max invitations limit
 */
export const updateMaxInvitations = async (maxInvitations: number): Promise<void> => {
  await httpClient.put('/settings/max-invitations', { maxInvitations });
};
