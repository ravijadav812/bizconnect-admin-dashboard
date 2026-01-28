/**
 * @fileoverview Edit user component for password updates
 * @author Enterprise Development Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import { User } from '@/types';
import { userService } from '@/services/userService';
import { useToast } from '@/hooks/use-toast';

/**
 * Edit user component - allows password updates only
 */
export const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  /**
   * Fetch user details
   */
  const fetchUser = async () => {
    if (!id) return;
    
    try {
      setIsFetching(true);
      console.log('Fetching user with ID:', id);
      const response = await userService.getById(id);
      console.log('User fetch response:', response);
      
      // Handle different response formats
      const userData = response.data || response;
      console.log('User data:', userData);
      
      if (userData && typeof userData === 'object' && 'id' in userData) {
        setUser(userData as User);
      } else {
        throw new Error('No user data received');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user details. Please try again.',
        variant: 'destructive'
      });
      navigate('/dashboard/users');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !user) return;

    // Validate password
    if (!password.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Password is required.',
        variant: 'destructive'
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Validation Error',
        description: 'Passwords do not match.',
        variant: 'destructive'
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: 'Validation Error',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log('Updating user password with PUT method for ID:', id);
      
      // Call PUT /api/v1/admin/users/{id} with only password
      await userService.update(id, { password });
      console.log('Password update successful');
      
      toast({
        title: 'Success',
        description: 'User password updated successfully.',
      });
      
      navigate('/dashboard/users');
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user password. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">User not found.</p>
        <Button 
          onClick={() => navigate('/dashboard/users')} 
          className="mt-4"
        >
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Edit User
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
            Update password for {user.firstName} {user.lastName}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/dashboard/users')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </div>
      </div>

      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Basic user details (read-only)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input 
                value={`${user.firstName} ${user.lastName}`} 
                disabled 
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                value={user.email} 
                disabled 
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Role</Label>
              <Input 
                value={user.role} 
                disabled 
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Status</Label>
              <Input 
                value={user.isActive ? 'Active' : 'Inactive'} 
                disabled 
                className="bg-muted"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Update Form */}
      <Card>
        <CardHeader>
          <CardTitle>Update Password</CardTitle>
          <CardDescription>
            Change the user's password. Password must be at least 8 characters long.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Password
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/users')}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditUser;