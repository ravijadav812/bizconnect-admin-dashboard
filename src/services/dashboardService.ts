/**
 * @fileoverview Dashboard data service
 * @author Enterprise Development Team
 * @version 1.0.0
 */

import httpClient from '@/api/httpClient';

export interface KpiCard {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
  format: 'number' | 'currency' | 'percentage';
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface RecentActivity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  user?: string;
}

export interface DashboardData {
  kpiCards: KpiCard[];
  userGrowthData: ChartDataPoint[];
  revenueData: ChartDataPoint[];
  categoryDistribution: PieChartData[];
  recentActivities: RecentActivity[];
  lastUpdated: string;
}

/**
 * Get dashboard data for a specific time period
 */
export const getDashboardData = async (period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<DashboardData> => {
  const response = await httpClient.get('/dashboard', { params: { period } });
  return response.data;
};

/**
 * Get dashboard summary
 */
export const getDashboardSummary = async (): Promise<{ totalUsers: number; totalRevenue: number; activeUsers: number }> => {
  const response = await httpClient.get('/dashboard/summary');
  return response.data;
};
