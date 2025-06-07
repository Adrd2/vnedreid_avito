/**
 * Configuration file for the application
 */

interface Config {
  /**
   * Base URL for the API
   */
  apiUrl: string;
  
  /**
   * Environment (development, production, etc.)
   */
  environment: string;
  
  /**
   * Debug mode
   */
  debug: boolean;
}

/**
 * Default configuration values
 */
const defaultConfig: Config = {
  apiUrl: 'http://localhost:3000/api',
  environment: 'development',
  debug: true,
};

/**
 * Production configuration values
 */
const prodConfig: Config = {
  apiUrl: 'https://api.autocheck.ai/api',
  environment: 'production',
  debug: false,
};

/**
 * Get the configuration based on the environment
 */
const getConfig = (): Config => {
  const env = import.meta.env.MODE || 'development';
  
  if (env === 'production') {
    return prodConfig;
  }
  
  return defaultConfig;
};

export const config = getConfig();

export default config;
