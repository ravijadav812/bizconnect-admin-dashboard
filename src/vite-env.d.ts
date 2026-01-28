/// <reference types="vite/client" />

/**
 * Environment variables interface for Vite
 * Extends ImportMetaEnv to include custom environment variables
 */
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
