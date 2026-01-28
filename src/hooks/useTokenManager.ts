/**
 * @fileoverview Token management hook with automatic refresh and activity tracking
 * @author Enterprise Development Team
 * @version 1.0.0
 * @compliance ISO/IEC 12207, CMMI Level 3+
 */

import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { 
  refreshAccessToken, 
  isTokenExpired, 
  getTimeUntilExpiry, 
  storeTokens, 
  clearTokens 
} from '@/services/tokenService';
import { useToast } from '@/hooks/use-toast';

const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const TOKEN_REFRESH_BUFFER = 2 * 60 * 1000; // 2 minutes before expiry

/**
 * Hook for managing token lifecycle with automatic refresh and activity tracking
 */
export function useTokenManager() {
  const { logout, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  
  const lastActivityRef = useRef<number>(Date.now());
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();
  const inactivityTimeoutRef = useRef<NodeJS.Timeout>();
  const isRefreshingRef = useRef<boolean>(false);

  /**
   * Update last activity timestamp
   */
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    // Clear existing inactivity timeout
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    
    // Set new inactivity timeout
    inactivityTimeoutRef.current = setTimeout(() => {
      // Token will expire due to inactivity - no action needed
      // Refresh will happen on next activity if token is expired
    }, INACTIVITY_TIMEOUT);
  }, []);

  /**
   * Perform token refresh
   */
  const performTokenRefresh = useCallback(async (): Promise<boolean> => {
    if (isRefreshingRef.current) {
      return false;
    }

    isRefreshingRef.current = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await refreshAccessToken(refreshToken);
      storeTokens(response.accessToken, response.refreshToken, response.expiresIn);
      
      console.log('Token refreshed successfully');
      return true;
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      
      // Check if refresh token is invalid (401/403)
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast({
          title: 'Session Expired',
          description: 'Your session has expired. Please log in again.',
          variant: 'destructive',
        });
        logout();
        return false;
      }
      
      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  }, [logout, toast]);

  /**
   * Schedule automatic token refresh
   */
  const scheduleTokenRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    if (!isAuthenticated) {
      return;
    }

    const timeUntilExpiry = getTimeUntilExpiry();
    const refreshTime = Math.max(0, timeUntilExpiry - TOKEN_REFRESH_BUFFER);

    refreshTimeoutRef.current = setTimeout(async () => {
      await performTokenRefresh();
      scheduleTokenRefresh(); // Schedule next refresh
    }, refreshTime);
  }, [isAuthenticated, performTokenRefresh]);

  /**
   * Handle user activity and refresh token if needed
   */
  const handleActivity = useCallback(async () => {
    updateActivity();

    if (!isAuthenticated) {
      return;
    }

    // Check if token is expired and user is active
    if (isTokenExpired()) {
      console.log('Token expired, attempting refresh due to user activity');
      const refreshed = await performTokenRefresh();
      
      if (refreshed) {
        scheduleTokenRefresh();
      }
    }
  }, [isAuthenticated, performTokenRefresh, scheduleTokenRefresh, updateActivity]);

  /**
   * Setup activity listeners and token management
   */
  useEffect(() => {
    if (!isAuthenticated) {
      // Clean up when not authenticated
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      return;
    }

    // Add activity listeners
    ACTIVITY_EVENTS.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initialize activity tracking
    updateActivity();
    
    // Schedule initial token refresh if needed
    scheduleTokenRefresh();

    return () => {
      // Cleanup listeners
      ACTIVITY_EVENTS.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      // Clear timeouts
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [isAuthenticated, handleActivity, scheduleTokenRefresh, updateActivity]);

  return {
    refreshToken: performTokenRefresh,
    isRefreshing: isRefreshingRef.current
  };
}