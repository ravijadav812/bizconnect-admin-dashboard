/**
 * @fileoverview Token manager component for handling automatic token refresh and session management
 * @author Enterprise Development Team
 * @version 1.0.0
 * @compliance ISO/IEC 12207, CMMI Level 3+
 */

import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useTokenManager } from '@/hooks/useTokenManager';
import { useToast } from '@/hooks/use-toast';

/**
 * Token manager component that handles automatic token refresh and session management
 * Should be mounted at the app root level
 */
export const TokenManager: React.FC = () => {
  const { logout } = useAuthStore();
  const { toast } = useToast();
  useTokenManager(); // Initialize token management

  /**
   * Handle session expiration events from HTTP interceptor
   */
  useEffect(() => {
    const handleSessionExpired = () => {
      toast({
        title: 'Session Expired',
        description: 'Your session has expired. Please log in again.',
        variant: 'destructive',
      });
      logout();
    };

    // Listen for session expiration events from HTTP interceptor
    window.addEventListener('auth:session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, [logout, toast]);

  // This component doesn't render anything visible
  return null;
};

export default TokenManager;