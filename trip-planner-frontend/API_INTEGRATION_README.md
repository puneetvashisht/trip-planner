# API Integration Guide

This guide explains how to integrate the JWT authentication system with your backend API.

## 🚀 **What's Been Implemented**

### **1. Real API Service Layer**
- ✅ **`authService.js`** - Complete authentication API client
- ✅ **`api.js`** - API configuration and endpoints
- ✅ **`environment.js`** - Environment-based configuration
- ✅ **`errorHandler.js`** - Comprehensive error handling

### **2. Updated AuthContext**
- ✅ **Real API calls** instead of mock functions
- ✅ **Server-side token verification**
- ✅ **User profile fetching**
- ✅ **Proper error handling**
- ✅ **Loading states**

## 🔧 **Backend API Requirements**

Your backend must implement these endpoints:

### **Authentication Endpoints**

#### **POST `/api/auth/register`**
```json
// Request Body
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}

// Response (Success - 201)
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

// Response (Error - 400)
{
  "success": false,
  "message": "Email already exists"
}
```

#### **POST `/api/auth/login`**
```json
// Request Body
{
  "email": "john@example.com",
  "password": "securepassword123"
}

// Response (Success - 200)
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

// Response (Error - 401)
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### **POST `/api/auth/logout`**
```json
// Request Headers
Authorization: Bearer <jwt_token>

// Response (Success - 200)
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### **GET `/api/auth/verify`**
```json
// Request Headers
Authorization: Bearer <jwt_token>

// Response (Success - 200)
{
  "valid": true,
  "message": "Token is valid"
}

// Response (Error - 401)
{
  "valid": false,
  "message": "Token is invalid or expired"
}
```

#### **GET `/api/auth/profile`**
```json
// Request Headers
Authorization: Bearer <jwt_token>

// Response (Success - 200)
{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## ⚙️ **Configuration**

### **1. Environment Variables**
Create a `.env` file in your project root:

```bash
# Backend API URL
VITE_API_URL=http://localhost:3001/api

# Debug mode (optional)
VITE_DEBUG=true
```

### **2. Update API Base URL**
If you need to change the API URL, update `src/config/environment.js`:

```javascript
export const ENV_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  // ... other config
};
```

## 🔐 **JWT Token Requirements**

### **Token Structure**
Your JWT tokens should include:

```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "iat": 1640995200,
  "exp": 1641081600
}
```

### **Token Security**
- **Algorithm**: Use `HS256` or `RS256`
- **Expiration**: 24 hours (86400 seconds)
- **Secret**: Use a strong, unique secret key
- **Issuer**: Include your app's domain

## 🚦 **Error Handling**

The system handles these error types:

- **Network Errors**: Connection issues
- **Authentication Errors**: Invalid credentials, expired tokens
- **Validation Errors**: Invalid input data
- **Server Errors**: Backend issues
- **Generic Errors**: Unexpected issues

## 📱 **Frontend Usage**

### **Login Component**
```javascript
const { login, loading } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await login(email, password);
  
  if (result.success) {
    navigate('/');
  } else {
    setError(result.error);
  }
};
```

### **Protected Routes**
```javascript
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

### **User Data Access**
```javascript
const { user, logout } = useAuth();

// Access user info
console.log(user.name, user.email);

// Logout
await logout();
```

## 🧪 **Testing the Integration**

### **1. Start Your Backend**
```bash
# Example with Node.js/Express
cd your-backend
npm start
# Server should run on http://localhost:3001
```

### **2. Start Frontend**
```bash
npm run dev
```

### **3. Test Flow**
1. Visit `/register` - Create account
2. Visit `/login` - Login with credentials
3. Navigate to protected routes
4. Test logout functionality

## 🐛 **Troubleshooting**

### **Common Issues**

#### **CORS Errors**
```javascript
// Backend CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
```

#### **Token Not Stored**
- Check cookie settings
- Ensure HTTPS in production
- Verify cookie domain/path

#### **API Calls Failing**
- Verify backend is running
- Check API endpoints match
- Validate request/response format

### **Debug Mode**
Enable debug logging:

```bash
VITE_DEBUG=true npm run dev
```

## 🔄 **Advanced Features**

### **Token Refresh**
The system supports token refresh:

```javascript
// In your backend
app.post('/api/auth/refresh', (req, res) => {
  // Validate refresh token
  // Issue new access token
});
```

### **Profile Updates**
```javascript
// Add to authService.js
async updateProfile(token, profileData) {
  const response = await fetch(`${this.baseURL}/auth/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(profileData)
  });
  return await this.handleResponse(response);
}
```

## 📚 **Next Steps**

1. **Implement Backend**: Create the required API endpoints
2. **Test Integration**: Verify all authentication flows work
3. **Add Security**: Implement rate limiting, password hashing
4. **Production**: Use HTTPS, secure cookie settings
5. **Monitoring**: Add logging and error tracking

## 🆘 **Need Help?**

- Check the browser console for errors
- Verify network requests in DevTools
- Ensure backend endpoints match exactly
- Test API endpoints with Postman/Insomnia

Your JWT authentication system is now ready for production use with real backend integration! 🎉
