# Trip Planner API - User-Specific Endpoints

This document describes the new API endpoints that provide role-based access to trips, itineraries, and activities.

## Overview

The API now supports role-based access control where:
- **Admin users** can see all trips, itineraries, and activities
- **Regular users** can only see trips they own or collaborate on, along with their associated itineraries and activities

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### JWT Token Features

The JWT tokens now include the user ID in the claims for enhanced security and user identification:

**Token Claims:**
- `sub` (subject): Username
- `userId`: User's unique identifier
- `iat` (issued at): Token creation timestamp
- `exp` (expiration): Token expiration timestamp

**Benefits:**
- User ID can be extracted from token without database lookup
- Enhanced security through user-specific token validation
- Improved performance for user identification
- Better audit trail and logging capabilities

## New Endpoints

### 1. Get User Dashboard
**GET** `/api/trips/dashboard`

Returns a comprehensive view of all user data including:
- User information
- All accessible trips
- All accessible itinerary items
- All accessible activities
- Admin status

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "roles": ["USER"]
  },
  "trips": [...],
  "itineraryItems": [...],
  "activities": [...],
  "isAdmin": false
}
```

### 2. Get User's Trips
**GET** `/api/trips/my-trips`

Returns all trips that the current user has access to (owned or collaborated on).

**Response:** Array of `TripResponseDto` objects

### 3. Get Trip Details (with access control)
**GET** `/api/trips/{tripId}/details`

Returns detailed information about a specific trip if the user has access.

**Response:** `TripResponseDto` object

### 4. Get All Activities
**GET** `/api/trips/activities`

Returns all activities from trips the user has access to.

**Response:** Array of `ActivityResponseDto` objects

### 5. Get All Itinerary Items
**GET** `/api/trips/itinerary`

Returns all itinerary items from trips the user has access to.

**Response:** Array of `ItineraryItemResponseDto` objects

## Role-Based Access Control

### Admin Users
- Can access all trips, itineraries, and activities
- No restrictions on data visibility
- Can view any user's trip data

### Regular Users
- Can only access trips they own or collaborate on
- Itinerary items and activities are filtered based on accessible trips
- Cannot view other users' private trip data

## Data Models

### TripResponseDto
```json
{
  "id": 1,
  "title": "Summer Vacation",
  "description": "A relaxing summer trip",
  "startDate": "2024-06-01",
  "endDate": "2024-06-07",
  "owner": {...},
  "collaborators": [...],
  "itinerary": [...],
  "budgetItems": [...],
  "packingList": [...],
  "destinations": [...]
}
```

### ItineraryItemResponseDto
```json
{
  "id": 1,
  "title": "Day 1 - Arrival",
  "description": "Arrive and check in",
  "startTime": "2024-06-01T14:00:00",
  "endTime": "2024-06-01T16:00:00",
  "location": "Hotel",
  "activities": [...]
}
```

### ActivityResponseDto
```json
{
  "id": 1,
  "title": "Check-in",
  "description": "Hotel check-in process",
  "location": "Hotel Lobby",
  "startTime": "14:00:00",
  "endTime": "14:30:00"
}
```

## Security

- All new endpoints require authentication
- JWT tokens are validated on each request
- Role-based access is enforced at the service layer
- Users cannot access data they don't have permission to view

## Error Handling

- **401 Unauthorized**: Invalid or missing JWT token
- **403 Forbidden**: User doesn't have permission to access the requested resource
- **404 Not Found**: Requested resource doesn't exist
- **500 Internal Server Error**: Server-side error

## Example Usage

### Get User Dashboard
```bash
curl -H "Authorization: Bearer <jwt-token>" \
     http://localhost:8080/api/trips/dashboard
```

### Get User's Trips
```bash
curl -H "Authorization: Bearer <jwt-token>" \
     http://localhost:8080/api/trips/my-trips
```

### Get Trip Details
```bash
curl -H "Authorization: Bearer <jwt-token>" \
     http://localhost:8080/api/trips/1/details
```

### Test JWT Token Generation
```bash
# Generate a JWT token for a specific user (for testing purposes)
curl http://localhost:8080/api/test/jwt-token/username

# This will return a token with user ID included in claims
```

## Notes

- The `/api/trips` endpoint remains public for backward compatibility
- All new endpoints are secured and require authentication
- Role checking is performed at the service layer for better security
- The API automatically filters data based on user permissions

## JWT Token Utilities

### JwtTokenUtil
- `generateToken(UserDetails)`: Generate JWT token with user ID in claims
- `generateRefreshToken(UserDetails)`: Generate refresh token with user ID in claims
- `extractUserId(String)`: Extract user ID from token claims
- `extractUsername(String)`: Extract username from token subject
- `validateToken(String)`: Validate token authenticity and expiration

### JwtTokenHelper
- `generateTokenForUser(User)`: Generate token directly from User entity
- `extractUserInfoFromToken(String)`: Extract comprehensive user info from token
- `getUserFromToken(String)`: Get User entity from valid token
- `isTokenForUser(String, Long)`: Check if token belongs to specific user

### CustomUserDetails
- Custom UserDetails implementation that includes User entity
- Provides access to user ID and other user information
- Used by Spring Security for authentication and authorization
