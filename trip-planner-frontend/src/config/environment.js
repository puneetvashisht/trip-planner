// Environment Configuration
// Update these values based on your backend setup

export const ENV_CONFIG = {
  // Backend API URL - update this to match your backend
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:9090/api',
  
  // Frontend URL for CORS
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  
  // Environment
  NODE_ENV: import.meta.env.MODE || 'development',
  
  // Debug mode
  DEBUG: import.meta.env.VITE_DEBUG === 'true',
  
  // API timeout (in milliseconds)
  API_TIMEOUT: 10000,
  
  // Token refresh interval (in milliseconds) - 5 minutes
  TOKEN_REFRESH_INTERVAL: 5 * 60 * 1000,
};

// Log configuration in development
if (ENV_CONFIG.DEBUG) {
  console.log('Environment Configuration:', ENV_CONFIG);
}
