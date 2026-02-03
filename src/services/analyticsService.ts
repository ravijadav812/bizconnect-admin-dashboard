import httpClient from '@/api/httpClient';

export interface KpiCard {
  title: string;
  value: string | number;
  breakdown?: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  previousValue?: number;
  trend: 'up' | 'down' | 'stable';
  format: 'number' | 'percentage' | 'currency' | 'time';
}

export interface UserMetric {
  month: string;
  providers: number;
  clients: number;
  dau: number;
  mau: number;
  retention7: number;
  retention30: number;
}

export interface JobMetric {
  category: string;
  posted: number;
  active: number;
  completed: number;
  avgFillTime: number;
}

export interface VerificationMetric {
  status: string;
  count: number;
  percentage: number;
  avgTime: number;
}

export interface EngagementMetric {
  week: string;
  profileViews: number;
  repeatHires: number;
  returningClients: number;
}

export interface PlatformHealth {
  metric: string;
  opened: number;
  resolved: number;
  pending: number;
  avgResolutionTime: number;
}

export interface AnalyticsData {
  kpiCards: KpiCard[];
  userMetrics: UserMetric[];
  jobMetrics: JobMetric[];
  verificationMetrics: VerificationMetric[];
  engagementMetrics: EngagementMetric[];
  platformHealth: PlatformHealth[];
}

export interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  limit?: number;
  region?: string;
}

export const getAnalytics = async (params: AnalyticsParams = {}): Promise<AnalyticsData> => {
  const response = await httpClient.get<AnalyticsData>('/admin/analytics', {
    params
  });
  return response.data;
};
