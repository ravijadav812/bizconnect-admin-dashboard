/**
 * @fileoverview Create User form component
 * @author Enterprise Development Team
 * @version 1.0.0
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { userService } from '@/services/userService';
import { useToast } from '@/hooks/use-toast';

const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().min(1, 'Role is required'),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

const roles = [
  'admin',
  'manager', 
  'user',
  'viewer'
];

export const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'user',
    },
  });

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      const response = await userService.create({
        email: data.email,
        password: data.password,
        role: data.role,
      });
      
      toast({
        title: 'User Created Successfully',
        description: `User with email ${data.email} has been successfully created with role ${data.role}.`,
      });
      
      // Reset form to allow creating another user
      form.reset({
        email: '',
        password: '',
        role: 'user',
      });
    } catch (error: any) {
      console.error('User creation error:', error);
      toast({
        title: 'Error Creating User',
        description: error?.response?.data?.message || 'Failed to create user. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const selectedRole = form.watch('role');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Create New User
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
            Add a new user to the system with appropriate permissions
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard/users')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <Badge variant="secondary">New User</Badge>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* User Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>User Information</CardTitle>
                    <CardDescription>
                      Basic user credentials and details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="user@example.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter password" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role.charAt(0).toUpperCase() + role.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Role:</span>
                      <Badge variant="outline">
                        {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={form.formState.isSubmitting}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {form.formState.isSubmitting ? 'Creating...' : 'Create User'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate('/dashboard/users')}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
    </div>
  );
};

export default CreateUser;