import { API_BASE_URL, AUTH_ENDPOINTS, HTTP_STATUS, getDefaultHeaders, getAuthHeaders } from '../config/api.js';

class AuthService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      // Handle different error statuses
      switch (response.status) {
        case HTTP_STATUS.UNAUTHORIZED:
          throw new Error('Invalid credentials');
        case HTTP_STATUS.BAD_REQUEST:
          throw new Error(data.message || 'Invalid request data');
        case HTTP_STATUS.FORBIDDEN:
          throw new Error('Access denied');
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(data.message || 'Something went wrong');
      }
    }
    
    return data;
  }

  // Helper method to handle network errors
  async handleRequest(url, options) {
    try {
      const response = await fetch(url, options);
      return await this.handleResponse(response);
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check if the backend is running and CORS is configured.');
      }
      if (error.message.includes('CORS')) {
        throw new Error('CORS error: Backend server needs CORS configuration to allow requests from this origin.');
      }
      throw error;
    }
  }

  // User registration
  async register(userData) {
    return await this.handleRequest(`${this.baseURL}${AUTH_ENDPOINTS.REGISTER}`, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password
      })
    });
  }

  // User login
  async login(credentials) {
    return await this.handleRequest(`${this.baseURL}${AUTH_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password
      })
    });
  }

  // User logout
  async logout(token) {
    try {
      const response = await fetch(`${this.baseURL}${AUTH_ENDPOINTS.LOGOUT}`, {
        method: 'POST',
        headers: getAuthHeaders(token)
      });

      // Even if logout fails on server, we should clear local state
      if (response.ok) {
        return await this.handleResponse(response);
      }
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      // Return success even if server logout fails
      return { success: true, message: 'Logged out successfully' };
    }
  }

  // Verify token validity
  async verifyToken(token) {
    try {
      const response = await fetch(`${this.baseURL}${AUTH_ENDPOINTS.VERIFY}`, {
        method: 'GET',
        headers: getAuthHeaders(token)
      });

      if (response.status === HTTP_STATUS.UNAUTHORIZED) {
        return { valid: false, message: 'Token is invalid or expired' };
      }

      return await this.handleResponse(response);
    } catch (error) {
      return { valid: false, message: error.message };
    }
  }

  // Get user profile
  async getProfile(token) {
    return await this.handleRequest(`${this.baseURL}${AUTH_ENDPOINTS.PROFILE}`, {
      method: 'GET',
      headers: getAuthHeaders(token)
    });
  }

  // Refresh access token
  async refreshToken(refreshToken) {
    return await this.handleRequest(`${this.baseURL}${AUTH_ENDPOINTS.REFRESH}`, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify({
        refreshToken: refreshToken
      })
    });
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
