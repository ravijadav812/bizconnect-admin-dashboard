/**
 * @fileoverview Main dashboard home page with KPIs and widgets
 * @author Enterprise Development Team
 * @version 1.0.0
 * @compliance ISO/IEC 12207, CMMI Level 3+
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Shield, TrendingUp, TrendingDown, Activity, DollarSign, Eye, Plus, Download, RefreshCw, Building, Briefcase } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getDashboardData } from '@/services/dashboardService';
import { useToast } from '@/hooks/use-toast';

// Icon mapping for KPI cards
const iconMap: Record<string, any> = {
  Building,
  Users,
  Briefcase,
  Shield,
  Activity,
  DollarSign,
  Eye,
  TrendingUp
};

/**
 * Dashboard home page component
 */
export const DashboardHome: React.FC = () => {
  const { toast } = useToast();
  
  // Fetch dashboard data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: () => getDashboardData('monthly'),
    refetchInterval: 60000, // Refetch every minute
  });

  // Show error toast
  React.useEffect(() => {
    if (error) {
      toast({
        title: 'Error loading dashboard',
        description: 'Failed to fetch dashboard data. Please try again.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  /**
   * Format value based on type
   */
  const formatValue = (value: number, format: string): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value}%`;
      case 'number':
      default:
        return new Intl.NumberFormat('en-US').format(value);
    }
  };

  /**
   * Calculate percentage change
   */
  const calculateChange = (current: number, previous: number): number => {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-6 w-96" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-0 shadow-md">
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const { kpiData, registrationData, activeUsersData, jobsData, servicesData, applicationStatusData, regionData } = data;

  return <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
            Welcome back! Here's what's happening with your business network today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="shadow-sm text-xs sm:text-sm">
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="shadow-sm text-xs sm:text-sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Sync</span>
          </Button>
          <Button size="sm" className="shadow-md text-xs sm:text-sm">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Add Widget</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {kpiData.map((kpi, index) => {
        const Icon = iconMap[kpi.icon] || Activity;
        const change = kpi.previousValue ? calculateChange(kpi.value as number, kpi.previousValue) : 0;
        const isPositive = kpi.trend === 'up';
        return <Card key={index} className="card-interactive border-0 shadow-md bg-gradient-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-4 p-3 sm:p-6">
                <CardTitle className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {kpi.title}
                </CardTitle>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-0 p-3 sm:p-6">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                  {formatValue(kpi.value, kpi.format)}
                </div>
                
              </CardContent>
            </Card>;
      })}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {/* New Providers & Clients Registration - Line Chart */}
        <Card className="xl:col-span-2 card-elevated border-0 shadow-lg">
          <CardHeader className="pb-4 sm:pb-6 p-3 sm:p-6">
            <CardTitle className="text-lg sm:text-xl font-bold">New Registrations</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Monthly new providers and clients registration trend
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <LineChart data={registrationData} margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5
            }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={10} tick={{
                fontSize: 10
              }} />
                <YAxis fontSize={10} tick={{
                fontSize: 10
              }} />
                <Tooltip contentStyle={{
                fontSize: '12px',
                padding: '8px',
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} />
                <Line type="monotone" dataKey="providers" stroke="hsl(var(--primary))" strokeWidth={2} name="Providers" dot={{
                r: 3
              }} />
                <Line type="monotone" dataKey="clients" stroke="hsl(var(--destructive))" strokeWidth={2} name="Clients" dot={{
                r: 3
              }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Popular Services - Pie Chart */}
        <Card className="card-elevated border-0 shadow-lg">
          <CardHeader className="pb-4 sm:pb-6 p-3 sm:p-6">
            <CardTitle className="text-lg sm:text-xl font-bold">Popular Services</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Most requested service categories
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <PieChart>
                <Pie data={servicesData} cx="50%" cy="50%" outerRadius={window.innerWidth < 640 ? 60 : 100} dataKey="value" label={({
                name,
                percent
              }) => window.innerWidth < 640 ? `${(percent * 100).toFixed(0)}%` : `${name} ${(percent * 100).toFixed(0)}%`} fontSize={10}>
                  {servicesData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{
                fontSize: '12px',
                padding: '8px'
              }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily & Weekly Active Users - Bar Chart */}
        <Card className="xl:col-span-2">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Active Users</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Daily and weekly active user statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <BarChart data={activeUsersData} margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5
            }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" fontSize={10} tick={{
                fontSize: 10
              }} />
                <YAxis fontSize={10} tick={{
                fontSize: 10
              }} />
                <Tooltip contentStyle={{
                fontSize: '12px',
                padding: '8px'
              }} />
                <Bar dataKey="daily" fill="hsl(var(--primary))" name="Daily Active" radius={[2, 2, 0, 0]} />
                <Bar dataKey="weekly" fill="hsl(var(--muted))" name="Weekly Active" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Provider Applications Status - Donut Chart */}
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Provider Applications</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Status breakdown of provider applications
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <PieChart>
                <Pie data={applicationStatusData} cx="50%" cy="50%" innerRadius={window.innerWidth < 640 ? 40 : 60} outerRadius={window.innerWidth < 640 ? 70 : 100} dataKey="value">
                  {applicationStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{
                fontSize: '12px',
                padding: '8px'
              }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 gap-2 mt-3 sm:mt-4">
              {applicationStatusData.map((item, index) => <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{
                  backgroundColor: item.color
                }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}%</span>
                </div>)}
            </div>
          </CardContent>
        </Card>

        {/* Jobs Created vs Completed - Bar Chart */}
        <Card className="xl:col-span-2">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Job Performance</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              New jobs created vs successfully completed jobs
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <BarChart data={jobsData} margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5
            }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={10} tick={{
                fontSize: 10
              }} />
                <YAxis fontSize={10} tick={{
                fontSize: 10
              }} />
                <Tooltip contentStyle={{
                fontSize: '12px',
                padding: '8px'
              }} />
                <Bar dataKey="created" fill="hsl(var(--primary))" name="Jobs Created" radius={[2, 2, 0, 0]} />
                <Bar dataKey="completed" fill="hsl(var(--chart-2))" name="Jobs Completed" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* NZ Regions Activity Heatmap */}
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Regional Activity</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              User activity heatmap across New Zealand regions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {regionData.map((region, index) => {
                // Calculate heat intensity (0-1) based on activity level
                const intensity = region.activity / 100;
                // Generate color from cool (low activity) to hot (high activity)
                const hue = Math.round(240 - (intensity * 180)); // Blue to Red
                const saturation = Math.round(50 + (intensity * 40)); // 50% to 90%
                const lightness = Math.round(75 - (intensity * 35)); // 75% to 40%
                
                return (
                  <div 
                    key={index} 
                    className="relative p-3 sm:p-4 rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-md group cursor-pointer"
                    style={{
                      backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                      borderColor: `hsl(${hue}, ${saturation}%, ${lightness - 20}%)`
                    }}
                  >
                    <div className="text-center space-y-1">
                      <div className="font-semibold text-xs sm:text-sm text-gray-800">
                        {region.region}
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-gray-900">
                        {region.activity}%
                      </div>
                      <div className="text-xs text-gray-700">
                        {region.users} users
                      </div>
                    </div>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      {region.region}: {region.activity}% activity ({region.users} users)
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border">
              <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mb-2">
                <span>Activity Level</span>
                <span>Low → High</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs">0%</span>
                <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-blue-200 via-yellow-200 to-red-400"></div>
                <span className="text-xs">100%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default DashboardHome;