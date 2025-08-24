// Error handling utility for authentication
export const getErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Network error detection
export const isNetworkError = (error) => {
  return error.message?.includes('fetch') || 
         error.message?.includes('network') ||
         error.message?.includes('Failed to fetch');
};

// Authentication error detection
export const isAuthError = (error) => {
  return error.message?.includes('Invalid credentials') ||
         error.message?.includes('Unauthorized') ||
         error.message?.includes('Token');
};

// Validation error detection
export const isValidationError = (error) => {
  return error.message?.includes('Invalid request data') ||
         error.message?.includes('validation') ||
         error.message?.includes('required');
};

// Server error detection
export const isServerError = (error) => {
  return error.message?.includes('Server error') ||
         error.message?.includes('Internal server error');
};
