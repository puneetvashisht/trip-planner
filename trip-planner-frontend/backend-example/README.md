# Trip Planner Backend Example

This is a complete backend implementation that works with your frontend JWT authentication system.

## 🚀 **Quick Start**

### **1. Install Dependencies**
```bash
cd backend-example
npm install
```

### **2. Environment Setup**
Create a `.env` file in the `backend-example` directory:

```bash
# Backend Environment Configuration
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### **3. Start the Server**
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## 📚 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/profile` - Get user profile

### **Health Check**
- `GET /api/health` - Server status

### **Protected Route Example**
- `GET /api/protected` - Example protected endpoint

## 🔧 **Features**

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcrypt password security
- ✅ **Input Validation** - Request data validation
- ✅ **CORS Support** - Frontend integration ready
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **Token Management** - Secure token storage

## 🛡️ **Security Features**

- **JWT Tokens** - 24-hour expiration
- **Password Hashing** - bcrypt with salt rounds
- **Input Validation** - Express-validator middleware
- **CORS Protection** - Origin-restricted requests
- **Token Verification** - Middleware protection

## 📝 **Usage Examples**

### **Register a New User**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### **Login**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### **Access Protected Route**
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔄 **Integration with Frontend**

1. **Start Backend**: `npm run dev` (runs on port 3001)
2. **Start Frontend**: `npm run dev` (runs on port 5173)
3. **Test Authentication**: Visit `/register` or `/login` in your frontend
4. **Verify Integration**: Check browser network tab for API calls

## 🚨 **Production Considerations**

### **Security**
- Change `JWT_SECRET` to a strong, unique key
- Use environment variables for all secrets
- Implement rate limiting
- Add request logging
- Use HTTPS in production

### **Database**
- Replace in-memory storage with database (MongoDB, PostgreSQL, etc.)
- Implement proper user management
- Add password reset functionality
- Implement account verification

### **Performance**
- Add Redis for token storage
- Implement token refresh mechanism
- Add caching layers
- Monitor API performance

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Port Already in Use**
```bash
# Change port in .env file
PORT=3002
```

#### **CORS Errors**
- Verify `CORS_ORIGIN` matches your frontend URL
- Check browser console for CORS errors

#### **JWT Token Issues**
- Ensure `JWT_SECRET` is set
- Check token expiration
- Verify token format in requests

### **Debug Mode**
Enable debug logging by setting `NODE_ENV=development` in your `.env` file.

## 📚 **Next Steps**

1. **Database Integration** - Replace in-memory storage
2. **User Management** - Add user roles and permissions
3. **Password Reset** - Implement forgot password flow
4. **Email Verification** - Add account verification
5. **Rate Limiting** - Protect against abuse
6. **Logging** - Add comprehensive logging
7. **Testing** - Add unit and integration tests

## 🆘 **Need Help?**

- Check server console for error messages
- Verify all environment variables are set
- Test API endpoints with Postman/Insomnia
- Check browser network tab for request details

Your backend is now ready to work with the frontend JWT authentication system! 🎉
