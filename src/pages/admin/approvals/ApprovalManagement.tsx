/**
 * @fileoverview User Approval Management Page
 * @author Enterprise Development Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Eye, Check, X, RefreshCw, History } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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

const ApprovalManagement: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<PendingApprovalUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<PendingApprovalUser | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [approvalReason, setApprovalReason] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5, // Reduced from 10 to 5 to ensure pagination shows
    total: 0,
    pages: 0
  });
  const { toast } = useToast();

  /**
   * Fetch pending approvals
   */
  const fetchApprovals = async (page: number = pagination.page) => {
    try {
      console.log('ApprovalManagement: Starting to fetch approvals, page:', page);
      setLoadingState(LoadingState.LOADING);
      
      const response = await approvalService.getPendingApprovals({
        page,
        limit: pagination.limit
        // Removed nzbnApprovalStatus filter to show all statuses
      });
      
      console.log('ApprovalManagement: Received response:', response);
      
      setUsers(response.data);
      setPagination(prev => ({
        ...prev,
        page: response.meta.page,
        limit: response.meta.limit,
        total: response.meta.totalCount,
        pages: response.meta.totalPages
      }));
      
      console.log('ApprovalManagement: Updated pagination:', {
        page: response.meta.page,
        limit: response.meta.limit,
        total: response.meta.totalCount,
        pages: response.meta.totalPages
      });
      
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      console.error('ApprovalManagement: Error fetching approvals:', error);
      setLoadingState(LoadingState.ERROR);
      toast({
        title: 'Error',
        description: 'Failed to fetch approvals. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApproveClick = (user: PendingApprovalUser) => {
    setSelectedUser(user);
    setIsApproveDialogOpen(true);
  };

  const handleApprove = async (userId: string, reason: string = '') => {
    try {
      console.log('ApprovalManagement: Approving user:', userId, 'with reason:', reason);
      await approvalService.approveUser(userId, reason || 'NZBN verified successfully');
      
      toast({
        title: 'User Approved',
        description: 'User has been successfully approved.',
      });
      
      setIsApproveDialogOpen(false);
      setApprovalReason('');
      
      // Refresh the list
      fetchApprovals();
    } catch (error) {
      console.error('ApprovalManagement: Error approving user:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve user. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleReject = async (userId: string, reason: string = '') => {
    try {
      console.log('ApprovalManagement: Rejecting user:', userId, 'with reason:', reason);
      await approvalService.rejectUser(userId, reason || 'NZBN verification failed');
      
      toast({
        title: 'User Rejected',
        description: 'User has been rejected with remarks.',
        variant: 'destructive'
      });
      
      setIsRejectDialogOpen(false);
      setRejectionReason('');
      
      // Refresh the list
      fetchApprovals();
    } catch (error) {
      console.error('ApprovalManagement: Error rejecting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject user. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleView = (user: PendingApprovalUser) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleRejectClick = (user: PendingApprovalUser) => {
    setSelectedUser(user);
    setIsRejectDialogOpen(true);
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

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    fetchApprovals(page);
  };

  const isLoading = loadingState === LoadingState.LOADING;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            NZBN Approval Management
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
            Review and manage all NZBN approval requests
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/approvals/history')}>
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
          <Button variant="outline" size="sm" onClick={() => fetchApprovals()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading approvals...
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
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.serviceProviderProfile.firstName} {user.serviceProviderProfile.lastName}
                        </TableCell>
                        <TableCell>{user.serviceProviderProfile.businessName}</TableCell>
                        <TableCell className="font-mono text-sm">{user.serviceProviderProfile.nzbnNumber}</TableCell>
                        <TableCell>{getStatusBadge(user.serviceProviderProfile.nzbnApprovalStatus)}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{user.serviceProviderProfile.region}</TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(user)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            {/* Show approve/reject buttons for pending status */}
                            {user.serviceProviderProfile.nzbnApprovalStatus === 'pending' && (
                              <>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleApproveClick(user)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleRejectClick(user)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            
                            {/* Show reject button for approved status */}
                            {user.serviceProviderProfile.nzbnApprovalStatus === 'approved' && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRejectClick(user)}
                                title="Reject this approved user"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {/* Show approve button for rejected status */}
                            {user.serviceProviderProfile.nzbnApprovalStatus === 'rejected' && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleApproveClick(user)}
                                className="bg-green-600 hover:bg-green-700"
                                title="Approve this rejected user"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {(() => {
                console.log('ApprovalManagement: Rendering pagination check, pages:', pagination.pages, 'total:', pagination.total, 'isLoading:', isLoading);
                // Show pagination if there are users (even if only 1 page) or if pages > 1  
                return !isLoading && (pagination.total > 0) && (
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
                          // Always show first page
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

                          // Show ellipsis if current page is far from start
                          if (currentPage > 4) {
                            pages.push(
                              <PaginationItem key="ellipsis-start">
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }

                          // Show pages around current page
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

                          // Show ellipsis if current page is far from end
                          if (currentPage < totalPages - 3) {
                            pages.push(
                              <PaginationItem key="ellipsis-end">
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }

                          // Always show last page if more than 1 page
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
              )})()}
            </>
          )}
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information for the selected user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">User Name</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.serviceProviderProfile.firstName} {selectedUser.serviceProviderProfile.lastName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedUser.serviceProviderProfile.nzbnApprovalStatus)}</div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Business Name</Label>
                <p className="text-sm text-muted-foreground">{selectedUser.serviceProviderProfile.businessName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Business Description</Label>
                <p className="text-sm text-muted-foreground">{selectedUser.serviceProviderProfile.businessDescription}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">NZBN Number</Label>
                <p className="text-sm text-muted-foreground font-mono">{selectedUser.serviceProviderProfile.nzbnNumber}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Region</Label>
                <p className="text-sm text-muted-foreground capitalize">{selectedUser.serviceProviderProfile.region}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Mobile Number</Label>
                <p className="text-sm text-muted-foreground">{selectedUser.serviceProviderProfile.mobileNumber}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Submitted At</Label>
                <p className="text-sm text-muted-foreground">{formatDate(selectedUser.createdAt)}</p>
              </div>
              {selectedUser.serviceProviderProfile.nzbnApprovalReason && (
                <div>
                  <Label className="text-sm font-medium">Rejection Remarks</Label>
                  <p className="text-sm text-muted-foreground bg-destructive/10 p-3 rounded-md border">
                    {selectedUser.serviceProviderProfile.nzbnApprovalReason}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject User Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reject User Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this user application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="remarks">Rejection Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Enter the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsRejectDialogOpen(false);
                  setRejectionReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedUser && handleReject(selectedUser.id, rejectionReason)}
              >
                Reject User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approve User Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Approve User Application</DialogTitle>
            <DialogDescription>
              You can optionally provide a reason for approving this user application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="approval-reason">Approval Reason (Optional)</Label>
              <Textarea
                id="approval-reason"
                placeholder="Enter the reason for approval (optional)..."
                value={approvalReason}
                onChange={(e) => setApprovalReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsApproveDialogOpen(false);
                  setApprovalReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() => selectedUser && handleApprove(selectedUser.id, approvalReason)}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovalManagement;