/**
 * @fileoverview NZBN Approval History Page
 * @author Enterprise Development Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { approvalService } from '@/services/approvalService';
import { PendingApprovalUser } from '@/types/approval';
import { LoadingState } from '@/types';

const ApprovalHistory: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<PendingApprovalUser[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    nzbnApprovalStatus: 'all',
    region: 'all',
    role: 'all'
  });
  const { toast } = useToast();

  /**
   * Fetch approval history
   */
  const fetchHistory = async (page: number = pagination.page) => {
    try {
      console.log('ApprovalHistory: Starting to fetch history, page:', page);
      console.log('ApprovalHistory: Filters:', filters);
      setLoadingState(LoadingState.LOADING);
      
      // Only send filters that have actual values (not empty, not "all")
      const cleanFilters: any = {};
      
      if (filters.search && filters.search.trim() !== '') {
        cleanFilters.search = filters.search;
      }
      if (filters.nzbnApprovalStatus && filters.nzbnApprovalStatus !== 'all') {
        cleanFilters.nzbnApprovalStatus = filters.nzbnApprovalStatus;
      }
      if (filters.region && filters.region !== 'all') {
        cleanFilters.region = filters.region;
      }
      if (filters.role && filters.role !== 'all') {
        cleanFilters.role = filters.role;
      }
      
      console.log('ApprovalHistory: Clean filters:', cleanFilters);
      
      const response = await approvalService.getApprovalHistory({
        page,
        limit: pagination.limit,
        ...cleanFilters
      });
      
      console.log('ApprovalHistory: Received response:', response);
      
      setUsers(response.data);
      setPagination(prev => ({
        ...prev,
        page: response.meta.page,
        limit: response.meta.limit,
        total: response.meta.totalCount,
        pages: response.meta.totalPages
      }));
      
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      console.error('ApprovalHistory: Error fetching history:', error);
      setLoadingState(LoadingState.ERROR);
      toast({
        title: 'Error',
        description: 'Failed to fetch approval history. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchHistory(1);
  }, [filters]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    fetchHistory(page);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isLoading = loadingState === LoadingState.LOADING;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            NZBN Approval History
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
            Complete history of all NZBN approval actions
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard/approvals')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Approvals
          </Button>
          <Button variant="outline" size="sm" onClick={() => fetchHistory()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search by name, email, or business..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div>
              <Select value={filters.nzbnApprovalStatus} onValueChange={(value) => handleFilterChange('nzbnApprovalStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filters.region} onValueChange={(value) => handleFilterChange('region', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="auckland">Auckland</SelectItem>
                  <SelectItem value="bay_of_plenty">Bay of Plenty</SelectItem>
                  <SelectItem value="canterbury">Canterbury</SelectItem>
                  <SelectItem value="hawkes_bay">Hawke's Bay</SelectItem>
                  <SelectItem value="manawatu_whanganui">Manawatū-Whanganui</SelectItem>
                  <SelectItem value="marlborough">Marlborough</SelectItem>
                  <SelectItem value="nelson">Nelson</SelectItem>
                  <SelectItem value="northland">Northland</SelectItem>
                  <SelectItem value="otago">Otago</SelectItem>
                  <SelectItem value="southland">Southland</SelectItem>
                  <SelectItem value="taranaki">Taranaki</SelectItem>
                  <SelectItem value="tasman">Tasman</SelectItem>
                  <SelectItem value="waikato">Waikato</SelectItem>
                  <SelectItem value="wellington">Wellington</SelectItem>
                  <SelectItem value="west_coast">West Coast</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filters.role} onValueChange={(value) => handleFilterChange('role', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="service_provider">Service Provider</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading history...
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Name</TableHead>
                      <TableHead>Business Name</TableHead>
                      <TableHead>NZBN Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Last Action</TableHead>
                      <TableHead>Approval Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No approval history found
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.serviceProviderProfile.firstName} {user.serviceProviderProfile.lastName}
                          </TableCell>
                          <TableCell>{user.serviceProviderProfile.businessName}</TableCell>
                          <TableCell className="font-mono text-sm">{user.serviceProviderProfile.nzbnNumber}</TableCell>
                          <TableCell>{getStatusBadge(user.serviceProviderProfile.nzbnApprovalStatus)}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="capitalize">{user.serviceProviderProfile.region.replace('_', ' ')}</TableCell>
                          <TableCell>
                            {user.serviceProviderProfile.nzbnApprovedAt 
                              ? formatDate(user.serviceProviderProfile.nzbnApprovedAt)
                              : formatDate(user.createdAt)
                            }
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {user.serviceProviderProfile.nzbnApprovalReason || '-'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {!isLoading && pagination.total > 0 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => pagination.page > 1 && handlePageChange(pagination.page - 1)}
                          className={pagination.page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>

                      {/* Page Numbers */}
                      {(() => {
                        const pages = [];
                        const totalPages = pagination.pages;
                        const currentPage = pagination.page;
                        const showEllipsis = totalPages > 7;
                        
                        if (!showEllipsis) {
                          // Show all pages if 7 or fewer
                          for (let i = 1; i <= totalPages; i++) {
                            pages.push(
                              <PaginationItem key={i}>
                                <PaginationLink
                                  onClick={() => handlePageChange(i)}
                                  isActive={currentPage === i}
                                  className="cursor-pointer"
                                >
                                  {i}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                        } else {
                          // Show pages with ellipsis
                          pages.push(
                            <PaginationItem key={1}>
                              <PaginationLink
                                onClick={() => handlePageChange(1)}
                                isActive={currentPage === 1}
                                className="cursor-pointer"
                              >
                                1
                              </PaginationLink>
                            </PaginationItem>
                          );

                          if (currentPage > 4) {
                            pages.push(
                              <PaginationItem key="ellipsis-start">
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }

                          const start = Math.max(2, currentPage - 1);
                          const end = Math.min(totalPages - 1, currentPage + 1);
                          
                          for (let i = start; i <= end; i++) {
                            if (i !== 1 && i !== totalPages) {
                              pages.push(
                                <PaginationItem key={i}>
                                  <PaginationLink
                                    onClick={() => handlePageChange(i)}
                                    isActive={currentPage === i}
                                    className="cursor-pointer"
                                  >
                                    {i}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            }
                          }

                          if (currentPage < totalPages - 3) {
                            pages.push(
                              <PaginationItem key="ellipsis-end">
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }

                          if (totalPages > 1) {
                            pages.push(
                              <PaginationItem key={totalPages}>
                                <PaginationLink
                                  onClick={() => handlePageChange(totalPages)}
                                  isActive={currentPage === totalPages}
                                  className="cursor-pointer"
                                >
                                  {totalPages}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                        }
                        
                        return pages;
                      })()}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => pagination.page < pagination.pages && handlePageChange(pagination.page + 1)}
                          className={pagination.page >= pagination.pages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalHistory;