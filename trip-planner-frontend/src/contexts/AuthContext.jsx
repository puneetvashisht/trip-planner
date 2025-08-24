import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, setToken, removeToken, isTokenValid, decodeToken } from '../utils/auth.js';
import authService from '../services/authService.js';
import { getErrorMessage } from '../utils/errorHandler.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on app start
    const checkAuthStatus = async () => {
      const token = getToken();
      if (token && isTokenValid(token)) {
        try {
          // Verify token with server
          const verification = await authService.verifyToken(token);
          if (verification.valid) {
            // Get user profile from server
            const profile = await authService.getProfile(token);
            setUser({
              id: profile.id,
              email: profile.email,
              username: profile.username
            });
          } else {
            // Token is invalid, remove it
            removeToken();
          }
        } catch (error) {
          // Error verifying token, remove it
          removeToken();
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      
      // Call the login API
      const response = await authService.login({ username, password });
      
      if (response.token) {
        // Store the JWT token
        setToken(response.token);
        
        // Set user data
        setUser({
          username: response.username
        });
        
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Login failed' };
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      setLoading(true);

      console.log(username, email, password);
      
      // Call the registration API
      const response = await authService.register({ username, email, password });
      
      if (response.success && response.token) {
        // Store the JWT token
        setToken(response.token);
        
        // Set user data
        setUser({
          id: response.user.id,
          email: response.user.email,
          username: response.user.username
        });
        
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Registration failed' };
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = getToken();
      if (token) {
        // Call logout API
        await authService.logout(token);
      }
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local state
      removeToken();
      setUser(null);
    }
  };

  const refreshUserProfile = async () => {
    try {
      const token = getToken();
      if (token && user) {
        const profile = await authService.getProfile(token);
        setUser({
          id: profile.id,
          email: profile.email,
          username: profile.username
        });
      }
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
