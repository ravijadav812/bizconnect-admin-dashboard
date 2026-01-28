/// <reference types="vite/client" />

/**
 * Environment variables interface for Vite
 * Extends ImportMetaEnv to include custom environment variables
 */
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_VERSION: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_ENVIRONMENT: string;
  readonly VITE_JWT_SECRET: string;
  readonly VITE_JWT_EXPIRES_IN: string;
  readonly VITE_REFRESH_TOKEN_EXPIRES_IN: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_NOTIFICATIONS: string;
  readonly VITE_ENABLE_REPORTS: string;
  readonly VITE_ANALYTICS_ID: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_DEV_PORT: string;
  readonly VITE_DEV_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}