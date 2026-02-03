/**
 * @fileoverview Job limits settings service
 * @author Enterprise Development Team
 * @version 1.0.0
 */

import httpClient from '@/api/httpClient';

export interface JobLimitsApiResponse {
  maxApplicationsPerJob: number;
  maxInvitationsPerJob: number;
}

export interface JobLimitsSettings {
  maxApplications: number;
  maxInvitations: number;
}

/**
 * Get current job-related limit settings
 */
export const getJobLimits = async (): Promise<JobLimitsSettings> => {
  const response = await httpClient.get<JobLimitsApiResponse>('/admin/settings/job-limits');
  return {
    maxApplications: response.data.maxApplicationsPerJob,
    maxInvitations: response.data.maxInvitationsPerJob,
  };
};

/**
 * Update maximum applications per job
 */
export const updateMaxApplications = async (maxApplications: number): Promise<JobLimitsSettings> => {
  const response = await httpClient.patch<JobLimitsApiResponse>('/admin/settings/max-applications', {
    maxApplicationsPerJob: maxApplications
  });
  return {
    maxApplications: response.data.maxApplicationsPerJob,
    maxInvitations: response.data.maxInvitationsPerJob,
  };
};

/**
 * Update maximum invitations per job
 */
export const updateMaxInvitations = async (maxInvitations: number): Promise<JobLimitsSettings> => {
  const response = await httpClient.patch<JobLimitsApiResponse>('/admin/settings/max-invitations', {
    maxInvitationsPerJob: maxInvitations
  });
  return {
    maxApplications: response.data.maxApplicationsPerJob,
    maxInvitations: response.data.maxInvitationsPerJob,
  };
};
