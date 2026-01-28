/**
 * @fileoverview Index page - redirects to appropriate route based on auth status
 * @author Enterprise Development Team
 * @version 1.0.0
 * @compliance ISO/IEC 12207, CMMI Level 3+
 */

import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useIsAuthenticated } from '@/stores/authStore';

/**
 * Index page component that handles initial routing
 * 
 * @returns JSX element with navigation redirect
 */
const Index: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Index;