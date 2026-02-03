/**
 * @fileoverview Token management service for handling token lifecycle
 * @author Enterprise Development Team
 * @version 1.0.0
 * @compliance ISO/IEC 12207, CMMI Level 3+
 */

import httpClient from '@/api/httpClient';

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

/**
 * Refresh access token using refresh token
 * @param refreshToken - The refresh token
 * @returns Promise resolving to new token data
 */
export async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
  const response = await httpClient.post('/auth/tokens/refresh', {
    refreshToken
  });
  
  return response.data;
}

/**
 * Validate current access token
 * @returns Promise resolving to token validation result
 */
export async function validateToken(): Promise<any> {
  const response = await httpClient.get('/auth/tokens/validate');
  return response.data;
}

/**
 * Revoke all refresh tokens for current user
 * @returns Promise resolving when tokens are revoked
 */
export async function revokeAllTokens(): Promise<void> {
  await httpClient.delete('/auth/tokens/revoke-all');
}

/**
 * Revoke tokens for current session only
 * @returns Promise resolving when session tokens are revoked
 */
export async function revokeSession(): Promise<void> {
  await httpClient.delete('/auth/tokens/revoke-session');
}

/**
 * Check if access token is expired
 * @returns boolean indicating if token is expired
 */
export function isTokenExpired(): boolean {
  const expiry = localStorage.getItem('tokenExpiry');
  if (!expiry) return true;
  
  return Date.now() >= parseInt(expiry);
}

/**
 * Get time until token expires in milliseconds
 * @returns number of milliseconds until expiration, or 0 if expired
 */
export function getTimeUntilExpiry(): number {
  const expiry = localStorage.getItem('tokenExpiry');
  if (!expiry) return 0;
  
  const timeLeft = parseInt(expiry) - Date.now();
  return Math.max(0, timeLeft);
}

/**
 * Store tokens in localStorage
 * @param accessToken - Access token
 * @param refreshToken - Refresh token
 * @param expiresIn - Expiry time in seconds
 */
export function storeTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('tokenExpiry', (Date.now() + (expiresIn * 1000)).toString());
}

/**
 * Clear all stored tokens
 */
export function clearTokens(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiry');
}