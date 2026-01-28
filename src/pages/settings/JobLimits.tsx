/**
 * @fileoverview Job limits settings page
 * @author Enterprise Development Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, RefreshCw, AlertCircle } from 'lucide-react';
import { getJobLimits, updateMaxApplications, updateMaxInvitations } from '@/services/jobLimitsService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function JobLimits() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [maxApplications, setMaxApplications] = useState<number>(0);
  const [maxInvitations, setMaxInvitations] = useState<number>(0);

  // Fetch current limits
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['jobLimits'],
    queryFn: getJobLimits
  });

  // Update state when data is loaded
  useEffect(() => {
    if (data) {
      setMaxApplications(data.maxApplications);
      setMaxInvitations(data.maxInvitations);
    }
  }, [data]);

  // Update max applications mutation
  const applicationsMutation = useMutation({
    mutationFn: updateMaxApplications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobLimits'] });
      toast({
        title: 'Success',
        description: 'Maximum applications limit updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update applications limit',
        variant: 'destructive',
      });
    }
  });

  // Update max invitations mutation
  const invitationsMutation = useMutation({
    mutationFn: updateMaxInvitations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobLimits'] });
      toast({
        title: 'Success',
        description: 'Maximum invitations limit updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update invitations limit',
        variant: 'destructive',
      });
    }
  });

  const handleSaveApplications = () => {
    if (maxApplications < 1) {
      toast({
        title: 'Invalid value',
        description: 'Maximum applications must be at least 1',
        variant: 'destructive',
      });
      return;
    }
    applicationsMutation.mutate(maxApplications);
  };

  const handleSaveInvitations = () => {
    if (maxInvitations < 1) {
      toast({
        title: 'Invalid value',
        description: 'Maximum invitations must be at least 1',
        variant: 'destructive',
      });
      return;
    }
    invitationsMutation.mutate(maxInvitations);
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: 'Refreshed',
      description: 'Job limits data refreshed',
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Job Limits Settings</h1>
            <p className="text-muted-foreground mt-1">Configure maximum applications and invitations per job</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="h-6 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-full bg-muted animate-pulse rounded mt-2" />
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-6 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-full bg-muted animate-pulse rounded mt-2" />
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Job Limits Settings</h1>
            <p className="text-muted-foreground mt-1">Configure maximum applications and invitations per job</p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load job limits settings. Please try again.
          </AlertDescription>
        </Alert>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Job Limits Settings</h1>
          <p className="text-muted-foreground mt-1">Configure maximum applications and invitations per job</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Settings Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Max Applications Card */}
        <Card>
          <CardHeader>
            <CardTitle>Maximum Applications Per Job</CardTitle>
            <CardDescription>
              Set the maximum number of applications a single job can receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxApplications">Maximum Applications</Label>
              <Input
                id="maxApplications"
                type="number"
                min="1"
                value={maxApplications}
                onChange={(e) => setMaxApplications(parseInt(e.target.value) || 0)}
                placeholder="Enter maximum applications"
              />
              <p className="text-sm text-muted-foreground">
                Current limit: {data?.maxApplications ?? 0}
              </p>
            </div>
            <Button
              onClick={handleSaveApplications}
              disabled={applicationsMutation.isPending || maxApplications === data?.maxApplications}
              className="w-full"
            >
              {applicationsMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Applications Limit
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Max Invitations Card */}
        <Card>
          <CardHeader>
            <CardTitle>Maximum Invitations Per Job</CardTitle>
            <CardDescription>
              Set the maximum number of invitations a single job can send
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxInvitations">Maximum Invitations</Label>
              <Input
                id="maxInvitations"
                type="number"
                min="1"
                value={maxInvitations}
                onChange={(e) => setMaxInvitations(parseInt(e.target.value) || 0)}
                placeholder="Enter maximum invitations"
              />
              <p className="text-sm text-muted-foreground">
                Current limit: {data?.maxInvitations ?? 0}
              </p>
            </div>
            <Button
              onClick={handleSaveInvitations}
              disabled={invitationsMutation.isPending || maxInvitations === data?.maxInvitations}
              className="w-full"
            >
              {invitationsMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Invitations Limit
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          These limits apply to all jobs on the platform. Changes take effect immediately for new jobs and applications.
        </AlertDescription>
      </Alert>
    </div>
  );
}
