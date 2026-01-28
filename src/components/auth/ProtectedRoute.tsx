/**
 * @fileoverview Protected route component for authentication guard
 * @author Enterprise Development Team
 * @version 1.0.0
 * @compliance ISO/IEC 12207, CMMI Level 3+
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useIsAuthenticated } from '@/stores/authStore';

/**
 * Props for ProtectedRoute component
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Protected route component that guards authenticated pages
 * 
 * Features:
 * - Redirects unauthenticated users to login
 * - Preserves intended destination in location state
 * - Supports custom redirect destination
 * 
 * @param props - Component props
 * @returns JSX element or navigation redirect
 * 
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 * ```
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;