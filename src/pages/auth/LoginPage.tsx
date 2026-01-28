/**
 * @fileoverview Login page component
 * @author Enterprise Development Team
 * @version 1.0.0
 * @compliance ISO/IEC 12207, CMMI Level 3+
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { useIsAuthenticated } from '@/stores/authStore';

/**
 * Login page component
 * 
 * Features:
 * - Redirects authenticated users to dashboard
 * - Centers login form on page
 * - Professional styling with enterprise branding
 * 
 * @returns JSX element
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  /**
   * Handle successful login
   */
  const handleLoginSuccess = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <div className="w-full max-w-md px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mx-auto mb-4">
            <img 
              src="/lovable-uploads/5be5b5ea-e547-423c-aae4-7af98c91141f.png" 
              alt="BizConnect Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            BizConnect
          </h1>
          <p className="text-muted-foreground mt-2">
            Secure access to your admin panel
          </p>
        </div>

        {/* Login Form */}
        <LoginForm onSuccess={handleLoginSuccess} />

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            Protected by enterprise-grade security
          </p>
          <p className="mt-1">
            CMMI Level 3+ Compliant • ISO/IEC 12207
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;