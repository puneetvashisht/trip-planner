# JWT Security Configuration for Trip Planner

This document describes the JWT (JSON Web Token) security configuration implemented in the Trip Planner application.

## Overview

The application now includes a complete JWT-based authentication and authorization system using Spring Security. This provides secure access to protected endpoints while maintaining stateless authentication.

## Components Added

### 1. Security Configuration Classes

- **`SecurityConfig.java`** - Main security configuration class with role-based access control
- **`JwtTokenUtil.java`** - Utility class for JWT token operations
- **`JwtAuthenticationFilter.java`** - Filter for JWT token validation
- **`JwtAuthenticationEntryPoint.java`** - Handles unauthorized access
- **`CustomUserDetailsService.java`** - Loads user details for authentication

### 2. Authentication Controller

- **`AuthController.java`** - Handles user registration, login, and token refresh

### 3. Role Management

- **`Role.java`** - Role entity with predefined role types (USER, ADMIN, MODERATOR)
- **`RoleRepository.java`** - Repository for role management
- **`RoleController.java`** - Admin-only controller for managing roles and user assignments
- **`RoleInitializationService.java`** - Service to initialize default roles and admin user

### 4. Test Endpoints

- **`TestController.java`** - Test endpoints to verify security configuration and role-based access

## API Endpoints

### Public Endpoints (No Authentication Required)

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `GET /api/test/public` - Public test endpoint
- `GET /api/test/roles-info` - Role information
- `GET /api/error` - Error handling

#### Trip Management (Public Access)
- `GET /api/trips` - Get all trips
- `GET /api/trips/{tripId}` - Get trip by ID
- `POST /api/trips` - Create new trip
- `POST /api/trips/{tripId}/itinerary` - Add itinerary item to trip

#### Itinerary Management (Public Access)
- `GET /api/itinerary` - Get all itinerary items
- `POST /api/itinerary` - Create itinerary item
- `PATCH /api/itinerary/{id}` - Update itinerary item
- `POST /api/itinerary/{id}/activities` - Add activity to itinerary
- `DELETE /api/itinerary/{id}/activities/{activityId}` - Delete activity from itinerary
- `PATCH /api/itinerary/{id}/activities/{activityId}` - Update activity in itinerary

### Protected Endpoints (Authentication Required)

- `GET /api/test/protected` - Protected test endpoint
- `GET /api/test/user` - User role required
- `GET /api/test/moderator` - Moderator role required
- `GET /api/test/admin` - Admin role required
- All other endpoints in the application

### Admin-Only Endpoints

- `GET /api/roles` - Get all roles
- `GET /api/roles/{id}` - Get role by ID
- `POST /api/roles` - Create new role
- `PUT /api/roles/{id}` - Update role
- `DELETE /api/roles/{id}` - Delete role
- `POST /api/roles/{userId}/assign/{roleId}` - Assign role to user
- `DELETE /api/roles/{userId}/remove/{roleId}` - Remove role from user

## Usage

### 1. User Registration

```bash
POST /api/auth/register
Content-Type: application/json

{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
}
```

### 2. User Login

```bash
POST /api/auth/login
Content-Type: application/json

{
    "username": "testuser",
    "password": "password123"
}
```

Response:
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
    "username": "testuser",
    "type": "Bearer"
}
```

### 3. Accessing Protected Endpoints

```bash
GET /api/test/protected
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

### 4. Token Refresh

```bash
POST /api/auth/refresh
Content-Type: application/json

{
    "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

## Configuration

### JWT Properties

The following properties are configured in `application.properties`:

```properties
jwt.secret=your-super-secret-jwt-key-that-is-at-least-256-bits-long-for-security
jwt.expiration=86400000          # 24 hours in milliseconds
jwt.refresh-token.expiration=172800000  # 48 hours in milliseconds
```

### Security Rules

- **Public Access**: `/api/auth/**`, `/api/public/**`, `/swagger-ui/**`, `/v3/api-docs/**`
- **Protected Access**: All other endpoints require valid JWT token
- **Session Management**: Stateless (no server-side sessions)
- **CSRF**: Disabled (not needed for JWT-based APIs)

## Dependencies

The following dependencies were added to `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
```

## Testing the Security

1. **Start the application**
2. **Test public endpoint**: `GET /api/test/public` (should work without token)
3. **Test protected endpoint**: `GET /api/test/protected` (should return 401 Unauthorized)
4. **Register a user**: `POST /api/auth/register`
5. **Login**: `POST /api/auth/login` (get JWT token)
6. **Test protected endpoint with token**: `GET /api/test/protected` with `Authorization: Bearer <token>`

## Testing Role-Based Access

### Default Admin User
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: ADMIN

### Testing Different Role Endpoints

1. **Login as regular user** (from registration)
   - Test `/api/test/user` - Should work
   - Test `/api/test/moderator` - Should return 403 Forbidden
   - Test `/api/test/admin` - Should return 403 Forbidden

2. **Login as admin user**
   - Test `/api/test/user` - Should work
   - Test `/api/test/moderator` - Should work
   - Test `/api/test/admin` - Should work
   - Test `/api/roles` - Should work (admin-only endpoint)

### Role Hierarchy
- **ADMIN**: Access to all endpoints including role management
- **MODERATOR**: Access to user and moderator endpoints
- **USER**: Access to basic user endpoints only

## Security Features

- **JWT Token Validation**: Every request to protected endpoints is validated
- **Password Encryption**: Passwords are encrypted using BCrypt
- **Token Expiration**: Access tokens expire after 24 hours
- **Refresh Tokens**: Long-lived refresh tokens for seamless authentication
- **Stateless Authentication**: No server-side session storage
- **CORS Support**: Cross-origin requests are supported
- **Role-Based Access Control**: Fine-grained access control based on user roles
- **Predefined Roles**: USER, ADMIN, and MODERATOR roles with hierarchical permissions
- **Automatic Role Assignment**: New users automatically get USER role
- **Admin User Creation**: Default admin user created on application startup

## Public vs Protected Access

### Public Access (No Authentication Required)
- **Trip Management**: All trip-related operations are publicly accessible
- **Itinerary Management**: All itinerary operations are publicly accessible
- **Authentication**: User registration and login endpoints

### Protected Access (Authentication Required)
- **User Management**: User profile and role management
- **Role Management**: Admin-only role operations
- **Test Endpoints**: Role-based access control testing

**Note**: Trip and itinerary data is publicly accessible. In production, consider implementing data privacy controls or user-specific data isolation if needed.

## Best Practices

1. **Keep JWT Secret Secure**: Store the JWT secret in environment variables in production
2. **Token Expiration**: Use short-lived access tokens and long-lived refresh tokens
3. **HTTPS**: Always use HTTPS in production for secure token transmission
4. **Token Storage**: Store tokens securely on the client side (HttpOnly cookies recommended)
5. **Logout**: Implement token blacklisting or use short expiration times for security

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check if JWT token is valid and not expired
2. **403 Forbidden**: Check if user has required authorities/roles
3. **Token Validation Errors**: Ensure JWT secret is properly configured
4. **CORS Issues**: Verify CORS configuration for frontend integration

### Debug Mode

Enable debug logging for Spring Security:

```properties
logging.level.org.springframework.security=DEBUG
logging.level.com.pv.trip_planner.security=DEBUG
```
