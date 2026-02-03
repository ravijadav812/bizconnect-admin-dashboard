/**
 * @fileoverview User management list page with CRUD operations
 * @author Enterprise Development Team
 * @version 1.0.0
 * @compliance ISO/IEC 12207, CMMI Level 3+
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Filter, Download, RefreshCw, Users, X } from 'lucide-react';
import { User, LoadingState, PaginationParams, UserRole } from '@/types';
import { userService } from '@/services/userService';
import { useToast } from '@/hooks/use-toast';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

/**
 * User list page component
 * 
 * Features:
 * - Paginated user table
 * - Search and filter functionality
 * - CRUD operations (Create, Read, Update, Delete)
 * - Bulk operations
 * - Role-based access control
 * - Responsive design
 * 
 * @returns JSX element
 */
export const UserList: React.FC = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();

  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    sortBy: 'createdAt',
    sortOrder: 'DESC' as 'ASC' | 'DESC',
    createdAfter: undefined as Date | undefined,
    createdBefore: undefined as Date | undefined,
    isActive: undefined as boolean | undefined,
    role: '',
    onboardingStatus: '',
    region: '',
    emailVerified: undefined as boolean | undefined,
    businessHelpOption: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    // Reduced from 10 to 5 to ensure pagination shows
    total: 0,
    pages: 0
  });

  /**
   * Fetch users with pagination, search, and filters
   */
  const fetchUsers = async (params: PaginationParams = {}) => {
    try {
      console.log('UserList: Starting to fetch users, params:', params);
      setLoadingState(LoadingState.LOADING);
      const queryParams: PaginationParams = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...params
      };
      console.log('UserList: Query params:', queryParams);

      // Add filter parameters if they have values
      if (filters.createdAfter) {
        queryParams.createdAfter = format(filters.createdAfter, 'yyyy-MM-dd');
      }
      if (filters.createdBefore) {
        queryParams.createdBefore = format(filters.createdBefore, 'yyyy-MM-dd');
      }
      if (filters.isActive !== undefined) {
        queryParams.isActive = filters.isActive;
      }
      if (filters.role) {
        queryParams.role = filters.role;
      }
      if (filters.onboardingStatus) {
        queryParams.onboardingStatus = filters.onboardingStatus;
      }
      if (filters.region) {
        queryParams.region = filters.region;
      }
      if (filters.emailVerified !== undefined) {
        queryParams.emailVerified = filters.emailVerified;
      }
      if (filters.businessHelpOption) {
        queryParams.businessHelpOption = filters.businessHelpOption;
      }
      const response = await userService.getAll(queryParams);
      console.log('UserList: Received response:', response);
      setUsers(response.data);
      setPagination(prev => ({
        ...prev,
        page: response.meta.page,
        limit: response.meta.limit,
        total: response.meta.totalCount,
        pages: response.meta.totalPages
      }));
      console.log('UserList: Updated pagination:', {
        page: response.meta.page,
        limit: response.meta.limit,
        total: response.meta.totalCount,
        pages: response.meta.totalPages
      });
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      console.error('UserList: Error fetching users:', error);
      setLoadingState(LoadingState.ERROR);
      toast({
        title: 'Error',
        description: 'Failed to fetch users. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Combined effect for initial load and filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers({
        page: 1
      });
    }, searchQuery ? 500 : 0); // Debounce search, immediate for filters

    return () => clearTimeout(timer);
  }, [filters, searchQuery]);

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setFilters({
      sortBy: 'createdAt',
      sortOrder: 'DESC',
      createdAfter: undefined,
      createdBefore: undefined,
      isActive: undefined,
      role: '',
      onboardingStatus: '',
      region: '',
      emailVerified: undefined,
      businessHelpOption: ''
    });
    setSearchQuery('');
  };

  /**
   * Handle user deletion
   */
  const handleDeleteUser = async (user: User) => {
    try {
      await userService.delete(user.id);
      toast({
        title: 'Success',
        description: `User ${user.firstName} ${user.lastName} has been deleted.`
      });

      // Refresh user list
      fetchUsers();
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive'
      });
    }
  };

  /**
   * Handle bulk user deletion
   */
  const handleBulkDelete = async () => {
    try {
      await userService.bulkDelete(selectedUsers);
      toast({
        title: 'Success',
        description: `${selectedUsers.length} users have been deleted.`
      });
      setSelectedUsers([]);
      fetchUsers();
    } catch (error) {
      console.error('Error bulk deleting users:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete users. Please try again.',
        variant: 'destructive'
      });
    }
  };

  /**
   * Handle user status toggle
   */
  const handleToggleStatus = async (user: User) => {
    try {
      if (user.isActive) {
        await userService.deactivate(user.id);
      } else {
        await userService.activate(user.id);
      }
      toast({
        title: 'Success',
        description: `User ${user.isActive ? 'deactivated' : 'activated'} successfully.`
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status. Please try again.',
        variant: 'destructive'
      });
    }
  };

  /**
   * Get user role badge variant
   */
  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      case 'user':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  const isLoading = loadingState === LoadingState.LOADING;
  return <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => fetchUsers()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild size="sm">
            <Link to="/dashboard/users/new">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Advanced Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Search & Filters</CardTitle>
              <CardDescription>
                Search and filter users with advanced criteria
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Basic Search */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by email, name, or business name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={filters.sortBy} onValueChange={value => setFilters(prev => ({
            ...prev,
            sortBy: value
          }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="firstName">First Name</SelectItem>
                <SelectItem value="lastName">Last Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="role">Role</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.sortOrder} onValueChange={(value: 'ASC' | 'DESC') => setFilters(prev => ({
            ...prev,
            sortOrder: value
          }))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DESC">Newest</SelectItem>
                <SelectItem value="ASC">Oldest</SelectItem>
              </SelectContent>
            </Select>
            {selectedUsers.length > 0 && <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedUsers.length})
              </Button>}
          </div>

          {/* Advanced Filters */}
          {showFilters && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={filters.isActive === undefined ? 'all' : filters.isActive.toString()} onValueChange={value => setFilters(prev => ({
              ...prev,
              isActive: value === 'all' ? undefined : value === 'true'
            }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Role Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={filters.role || 'all'} onValueChange={value => setFilters(prev => ({
              ...prev,
              role: value === 'all' ? '' : value
            }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Email Verified Filter */}
              

              {/* Onboarding Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Onboarding Status</label>
                <Select value={filters.onboardingStatus || 'all'} onValueChange={value => setFilters(prev => ({
              ...prev,
              onboardingStatus: value === 'all' ? '' : value
            }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
                </Select>
              </div>

              {/* Region Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Region</label>
                <Select value={filters.region || 'all'} onValueChange={value => setFilters(prev => ({
              ...prev,
              region: value === 'all' ? '' : value
            }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All regions</SelectItem>
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

              {/* Business Help Option Filter */}
              

              {/* Created After Filter */}
              

              {/* Created Before Filter */}
              
            </div>}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <CardTitle>Users ({pagination.total})</CardTitle>
            </div>
            <Badge variant="outline">
              Page {pagination.page} of {pagination.pages}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading users...</p>
              </div>
            </div> : <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input type="checkbox" onChange={e => {
                  if (e.target.checked) {
                    setSelectedUsers(users.map(u => u.id));
                  } else {
                    setSelectedUsers([]);
                  }
                }} checked={selectedUsers.length === users.length && users.length > 0} />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => <TableRow key={user.id}>
                    <TableCell>
                      <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={e => {
                  if (e.target.checked) {
                    setSelectedUsers([...selectedUsers, user.id]);
                  } else {
                    setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                  }
                }} />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'default' : 'secondary'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => navigate(`/dashboard/users/${user.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/dashboard/users/${user.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleStatus(user)} className={user.isActive ? 'text-orange-600' : 'text-green-600'}>
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                      setUserToDelete(user);
                      setDeleteDialogOpen(true);
                    }} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>}

          {/* Pagination */}
          {(() => {
          console.log('UserList: Rendering pagination check, pages:', pagination.pages, 'total:', pagination.total);
          // Show pagination if there are users (even if only 1 page) or if pages > 1
          return pagination.total > 0 && <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} users
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => {
                    if (pagination.page > 1) {
                      const newPage = pagination.page - 1;
                      setPagination(prev => ({
                        ...prev,
                        page: newPage
                      }));
                      fetchUsers({
                        page: newPage
                      });
                    }
                  }} className={pagination.page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                  </PaginationItem>

                  {/* Page Numbers */}
                  {(() => {
                  const pages = [];
                  const showEllipsis = pagination.pages > 7;
                  if (!showEllipsis) {
                    // Show all pages if 7 or fewer
                    for (let i = 1; i <= pagination.pages; i++) {
                      pages.push(<PaginationItem key={i}>
                            <PaginationLink onClick={() => {
                          setPagination(prev => ({
                            ...prev,
                            page: i
                          }));
                          fetchUsers({
                            page: i
                          });
                        }} isActive={pagination.page === i} className="cursor-pointer">
                              {i}
                            </PaginationLink>
                          </PaginationItem>);
                    }
                  } else {
                    // Show pages with ellipsis
                    // Always show first page
                    pages.push(<PaginationItem key={1}>
                          <PaginationLink onClick={() => {
                        setPagination(prev => ({
                          ...prev,
                          page: 1
                        }));
                        fetchUsers({
                          page: 1
                        });
                      }} isActive={pagination.page === 1} className="cursor-pointer">
                            1
                          </PaginationLink>
                        </PaginationItem>);

                    // Show ellipsis if current page is far from start
                    if (pagination.page > 4) {
                      pages.push(<PaginationItem key="ellipsis-start">
                            <PaginationEllipsis />
                          </PaginationItem>);
                    }

                    // Show pages around current page
                    const start = Math.max(2, pagination.page - 1);
                    const end = Math.min(pagination.pages - 1, pagination.page + 1);
                    for (let i = start; i <= end; i++) {
                      if (i !== 1 && i !== pagination.pages) {
                        pages.push(<PaginationItem key={i}>
                              <PaginationLink onClick={() => {
                            setPagination(prev => ({
                              ...prev,
                              page: i
                            }));
                            fetchUsers({
                              page: i
                            });
                          }} isActive={pagination.page === i} className="cursor-pointer">
                                {i}
                              </PaginationLink>
                            </PaginationItem>);
                      }
                    }

                    // Show ellipsis if current page is far from end
                    if (pagination.page < pagination.pages - 3) {
                      pages.push(<PaginationItem key="ellipsis-end">
                            <PaginationEllipsis />
                          </PaginationItem>);
                    }

                    // Always show last page if more than 1 page
                    if (pagination.pages > 1) {
                      pages.push(<PaginationItem key={pagination.pages}>
                            <PaginationLink onClick={() => {
                          setPagination(prev => ({
                            ...prev,
                            page: pagination.pages
                          }));
                          fetchUsers({
                            page: pagination.pages
                          });
                        }} isActive={pagination.page === pagination.pages} className="cursor-pointer">
                              {pagination.pages}
                            </PaginationLink>
                          </PaginationItem>);
                    }
                  }
                  return pages;
                })()}

                  <PaginationItem>
                    <PaginationNext onClick={() => {
                    if (pagination.page < pagination.pages) {
                      const newPage = pagination.page + 1;
                      setPagination(prev => ({
                        ...prev,
                        page: newPage
                      }));
                      fetchUsers({
                        page: newPage
                      });
                    }
                  }} className={pagination.page >= pagination.pages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>;
        })()}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user{' '}
              <strong>
                {userToDelete?.firstName} {userToDelete?.lastName}
              </strong>{' '}
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => userToDelete && handleDeleteUser(userToDelete)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export default UserList;