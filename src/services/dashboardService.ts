import httpClient from '@/api/httpClient';

export interface KpiDataItem {
  title: string;
  value: number;
  previousValue?: number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  trend: 'up' | 'down' | 'stable';
  icon: string;
  format: 'number' | 'percentage' | 'currency';
  breakdown?: string;
}

export interface RegistrationDataPoint {
  month: string;
  providers: number;
  clients: number;
}

export interface ActiveUsersDataPoint {
  period: string;
  daily: number;
  weekly: number;
}

export interface JobsDataPoint {
  month: string;
  created: number;
  completed: number;
}

export interface ServicesDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface ApplicationStatusDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface RegionDataPoint {
  region: string;
  users: number;
  activity: number;
}

export interface DashboardData {
  kpiData: KpiDataItem[];
  registrationData: RegistrationDataPoint[];
  activeUsersData: ActiveUsersDataPoint[];
  jobsData: JobsDataPoint[];
  servicesData: ServicesDataPoint[];
  applicationStatusData: ApplicationStatusDataPoint[];
  regionData: RegionDataPoint[];
}

export const getDashboardData = async (period: string = 'monthly'): Promise<DashboardData> => {
  const response = await httpClient.get<DashboardData>('/admin/analytics/dashboard', {
    params: { period }
  });
  return response.data;
};
