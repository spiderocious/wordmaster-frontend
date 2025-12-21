/**
 * Application Configuration
 *
 * Centralized configuration reading from environment variables
 */

interface AppConfig {
  apiBaseUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

function getConfig(): AppConfig {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const mode = import.meta.env.MODE;

  return {
    apiBaseUrl,
    isDevelopment: mode === 'development',
    isProduction: mode === 'production',
  };
}

export const config = getConfig();
