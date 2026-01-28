/**
 * @fileoverview Authentication type definitions for API integration
 * @author Enterprise Development Team
 * @version 1.0.0
 * @compliance ISO/IEC 12207, CMMI Level 3+
 */

/**
 * Token information from authentication response
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

/**
 * User profile information from authentication response
 */
export interface AuthUser {
  id: string;
  email: string;
  role: string;
  onboardingStatus: string;
  emailVerified: boolean;
  profile?: any;
}

/**
 * Response structure for successful login
 */
export interface LoginResponse {
  tokens: AuthTokens;
  user: AuthUser;
}