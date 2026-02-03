/**
 * @fileoverview Comprehensive Analytics Dashboard
 * @author Enterprise Development Team
 * @version 1.0.0
 * @compliance ISO/IEC 12207, CMMI Level 3+
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  UserCheck,
  Briefcase,
  Clock,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LucideIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { getAnalytics } from '@/services/analyticsService';
import { toast } from 'sonner';

const COLORS = ['#2563eb', '#8b5cf6', '#f59e0b', '#6b7280', '#ef4444'];

// Sanitize chart data to prevent Recharts crashes with undefined values
const sanitizeChartData = <T extends object>(
  data: T[] | undefined | null,
  requiredKeys: (keyof T)[]
): T[] => {
  if (!data || !Array.isArray(data) || data.length === 0) return [];
  
  return data
    .filter(item => item !== null && item !== undefined)
    .map(item => {
      const sanitized = { ...item };
      requiredKeys.forEach(key => {
        const value = sanitized[key];
        if (value === undefined || value === null || typeof value !== 'number' || isNaN(value as number)) {
          (sanitized as Record<string, unknown>)[key as string] = 0;
        }
      });
      return sanitized;
    });
};

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, LucideIcon> = {
  Users,
  Activity,
  Briefcase,
  Clock,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
};

export const AnalyticsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [activeTab, setActiveTab] = useState('users');

  // Fetch analytics data
  const { data: analyticsData, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics', selectedPeriod],
    queryFn: () => getAnalytics({ period: selectedPeriod as 'daily' | 'weekly' | 'monthly' | 'yearly' }),
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  // Handle error
  if (error) {
    toast.error('Failed to load analytics data');
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Platform Analytics</h1>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
              Comprehensive platform health and performance metrics
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => refetch()}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
{/* Export button hidden - functionality not implemented */}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {analyticsData?.kpiCards.map((kpi, index) => {
            const Icon = iconMap[kpi.icon] || Activity;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">{kpi.title}</CardTitle>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">{kpi.value}</div>
                  {kpi.breakdown && <p className="text-xs text-muted-foreground mt-1">{kpi.breakdown}</p>}
                   <div className="flex items-center gap-1 mt-2">
                     <Badge 
                       variant={kpi.changeType === 'positive' ? 'default' : kpi.changeType === 'negative' ? 'destructive' : 'secondary'}
                       className="text-xs"
                     >
                       {kpi.change}
                     </Badge>
                   </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full bg-muted/50">
            <TabsTrigger 
              value="users" 
              className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              User Metrics
            </TabsTrigger>
            <TabsTrigger 
              value="jobs" 
              className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              Job Metrics
            </TabsTrigger>
            <TabsTrigger 
              value="verification" 
              className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              Verification
            </TabsTrigger>
            <TabsTrigger 
              value="engagement" 
              className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              Engagement
            </TabsTrigger>
            <TabsTrigger 
              value="health" 
              className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              Platform Health
            </TabsTrigger>
          </TabsList>

          {/* User Metrics Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Registration Growth
                  </CardTitle>
                  <CardDescription>Providers vs Clients registration over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {(() => {
                      const sanitizedData = sanitizeChartData(analyticsData?.userMetrics, ['providers', 'clients']);
                      if (sanitizedData.length === 0) {
                        return (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            No user metrics data available
                          </div>
                        );
                      }
                      return (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={sanitizedData}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="month" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px'
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="providers" 
                              stroke="#2563eb" 
                              fill="#2563eb" 
                              fillOpacity={0.6}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="clients" 
                              stroke="#8b5cf6" 
                              fill="#8b5cf6" 
                              fillOpacity={0.6}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    User Retention Rates
                  </CardTitle>
                  <CardDescription>7-day and 30-day retention rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {analyticsData?.userMetrics && analyticsData.userMetrics.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData.userMetrics}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="month" fontSize={12} />
                          <YAxis fontSize={12} domain={[0, 100]} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px'
                            }}
                            formatter={(value) => [`${value}%`, '']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="retention7" 
                            stroke="#2563eb" 
                            strokeWidth={2}
                            name="7-day retention"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="retention30" 
                            stroke="#8b5cf6" 
                            strokeWidth={2}
                            name="30-day retention"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No retention data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

          </TabsContent>

          {/* Job Metrics Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Jobs by Category
                  </CardTitle>
                  <CardDescription>Distribution of jobs across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {analyticsData?.jobMetrics && analyticsData.jobMetrics.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.jobMetrics} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis type="number" fontSize={12} />
                          <YAxis dataKey="category" type="category" fontSize={11} width={80} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px'
                            }}
                          />
                          <Bar dataKey="posted" fill="#2563eb" name="Posted" />
                          <Bar dataKey="completed" fill="#8b5cf6" name="Completed" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No job metrics data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Average Time to Fill Jobs
                  </CardTitle>
                  <CardDescription>Days to fill jobs by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {analyticsData?.jobMetrics && analyticsData.jobMetrics.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.jobMetrics}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="category" fontSize={10} angle={-45} textAnchor="end" height={80} />
                          <YAxis fontSize={12} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px'
                            }}
                            formatter={(value) => [`${value} days`, 'Avg Fill Time']}
                          />
                          <Bar dataKey="avgFillTime" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No fill time data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Verification Status Distribution
                  </CardTitle>
                  <CardDescription>Business verification breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={analyticsData?.verificationMetrics || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="count"
                        >
                          {(analyticsData?.verificationMetrics || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px'
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {(analyticsData?.verificationMetrics || []).map((item, index) => (
                      <div key={item.status} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span>{item.status}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{item.count}</span>
                          <Badge variant="outline">{item.percentage}%</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Verification Processing Times
                  </CardTitle>
                  <CardDescription>Average time by status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(analyticsData?.verificationMetrics || []).map((item, index) => (
                      <div key={item.status} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.status}</span>
                          <span className="text-sm text-muted-foreground">{item.avgTime} days</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${(item.avgTime / 5) * 100}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Profile Views & Engagement
                  </CardTitle>
                  <CardDescription>Weekly profile views and repeat business</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {analyticsData?.engagementMetrics && analyticsData.engagementMetrics.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData.engagementMetrics}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="week" fontSize={12} />
                          <YAxis fontSize={12} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="profileViews" 
                            stroke="#2563eb" 
                            strokeWidth={2}
                            name="Profile Views"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="repeatHires" 
                            stroke="#8b5cf6" 
                            strokeWidth={2}
                            name="Repeat Hires"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No engagement data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Client Retention
                  </CardTitle>
                  <CardDescription>Returning clients over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {(() => {
                      const sanitizedData = sanitizeChartData(analyticsData?.engagementMetrics, ['returningClients']);
                      if (sanitizedData.length === 0) {
                        return (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            No engagement data available
                          </div>
                        );
                      }
                      return (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={sanitizedData}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="week" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px'
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="returningClients" 
                              stroke="#f59e0b" 
                              fill="#f59e0b" 
                              fillOpacity={0.3}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>

          </TabsContent>

          {/* Platform Health Tab */}
          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Support Tickets Overview
                  </CardTitle>
                  <CardDescription>Ticket volume and resolution status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData?.platformHealth.filter(h => h.metric === 'Support Tickets').map((health) => (
                      <React.Fragment key={health.metric}>
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-warning/10 rounded-full">
                              <AlertTriangle className="h-4 w-4 text-warning" />
                            </div>
                            <div>
                              <div className="font-medium">Opened This Month</div>
                              <div className="text-sm text-muted-foreground">New support requests</div>
                            </div>
                          </div>
                           <div className="text-right">
                             <div className="text-2xl font-bold">{health.opened}</div>
                             <div className="text-sm text-muted-foreground">New requests opened</div>
                           </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-success/10 rounded-full">
                              <CheckCircle className="h-4 w-4 text-success" />
                            </div>
                            <div>
                              <div className="font-medium">Resolved</div>
                              <div className="text-sm text-muted-foreground">Successfully closed</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{health.resolved}</div>
                            <div className="text-sm text-muted-foreground">
                              {health.opened > 0 ? ((health.resolved / health.opened) * 100).toFixed(1) : 0}% resolution rate
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-destructive/10 rounded-full">
                              <Clock className="h-4 w-4 text-destructive" />
                            </div>
                            <div>
                              <div className="font-medium">Pending</div>
                              <div className="text-sm text-muted-foreground">Awaiting response</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{health.pending}</div>
                            <div className="text-sm text-muted-foreground">Avg {health.avgResolutionTime} days to resolve</div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    Disputes & Resolution
                  </CardTitle>
                  <CardDescription>Client disputes and resolution metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData?.platformHealth.filter(h => h.metric === 'Disputes').map((health) => (
                      <React.Fragment key={health.metric}>
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-destructive/10 rounded-full">
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            </div>
                            <div>
                              <div className="font-medium">Disputes Raised</div>
                              <div className="text-sm text-muted-foreground">Client complaints</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{health.opened}</div>
                            <div className="text-sm text-muted-foreground">Total disputes</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-success/10 rounded-full">
                              <CheckCircle className="h-4 w-4 text-success" />
                            </div>
                            <div>
                              <div className="font-medium">Resolved</div>
                              <div className="text-sm text-muted-foreground">Successfully mediated</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{health.resolved}</div>
                            <div className="text-sm text-muted-foreground">
                              {health.opened > 0 ? ((health.resolved / health.opened) * 100).toFixed(1) : 0}% resolution rate
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-warning/10 rounded-full">
                              <Clock className="h-4 w-4 text-warning" />
                            </div>
                            <div>
                              <div className="font-medium">Pending Resolution</div>
                              <div className="text-sm text-muted-foreground">Under review</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{health.pending}</div>
                            <div className="text-sm text-muted-foreground">Avg {health.avgResolutionTime} days to resolve</div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

          </TabsContent>
        </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;