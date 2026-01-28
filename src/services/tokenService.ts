/**
 * @fileoverview Token management service
 * @author Enterprise Development Team
 * @version 1.0.0
 */

import Cookies from 'js-cookie';
import httpClient from '@/api/httpClient';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';

/**
 * Store tokens in cookies
 */
export const storeTokens = (accessToken: string, refreshToken: string, expiresIn: number): void => {
  const expiryTime = Date.now() + expiresIn * 1000;
  
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, { 
    expires: expiresIn / 86400, // Convert seconds to days
    secure: true,
    sameSite: 'strict'
  });
  
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
    expires: 30, // 30 days
    secure: true,
    sameSite: 'strict'
  });
  
  Cookies.set(TOKEN_EXPIRY_KEY, expiryTime.toString(), {
    expires: expiresIn / 86400,
    secure: true,
    sameSite: 'strict'
  });
};

/**
 * Clear all tokens from storage
 */
export const clearTokens = (): void => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(TOKEN_EXPIRY_KEY);
};

/**
 * Get the access token
 */
export const getAccessToken = (): string | undefined => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

/**
 * Get the refresh token
 */
export const getRefreshToken = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

/**
 * Check if the access token is expired
 */
export const isTokenExpired = (): boolean => {
  const expiryTime = Cookies.get(TOKEN_EXPIRY_KEY);
  if (!expiryTime) return true;
  
  return Date.now() >= parseInt(expiryTime, 10);
};

/**
 * Get time until token expiry in milliseconds
 */
export const getTimeUntilExpiry = (): number => {
  const expiryTime = Cookies.get(TOKEN_EXPIRY_KEY);
  if (!expiryTime) return 0;
  
  const expiry = parseInt(expiryTime, 10);
  const remaining = expiry - Date.now();
  
  return Math.max(0, remaining);
};

/**
 * Refresh the access token using the refresh token
 */
export const refreshAccessToken = async (): Promise<{ accessToken: string; refreshToken: string; expiresIn: number } | null> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    return null;
  }
  
  try {
    const response = await httpClient.post('/auth/refresh', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;
    
    storeTokens(accessToken, newRefreshToken, expiresIn);
    
    return { accessToken, refreshToken: newRefreshToken, expiresIn };
  } catch (error) {
    clearTokens();
    return null;
  }
};
