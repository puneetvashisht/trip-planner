# CORS Access Control Issue - Troubleshooting Guide

## Problem Description
```
Fetch API cannot load http://localhost:9090/api/trips/my-trips due to access control checks.
```

## Root Cause Analysis

The CORS (Cross-Origin Resource Sharing) access control issue typically occurs due to one of these reasons:

1. **Preflight Request Failure**: Browser sends OPTIONS request before the actual request
2. **Missing CORS Headers**: Server doesn't include proper CORS response headers
3. **Authentication Header Issues**: Authorization header not properly handled in CORS
4. **Filter Order Problems**: CORS filter not applied before security filter

## Solutions Implemented

### 1. Enhanced CORS Configuration

**SecurityConfig.java** now includes comprehensive CORS configuration:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    
    // Allow all origins for development
    configuration.addAllowedOriginPattern("*");
    
    // Allow all HTTP methods including OPTIONS for preflight
    configuration.addAllowedMethod("GET");
    configuration.addAllowedMethod("POST");
    configuration.addAllowedMethod("PUT");
    configuration.addAllowedMethod("DELETE");
    configuration.addAllowedMethod("PATCH");
    configuration.addAllowedMethod("OPTIONS");
    
    // Allow all headers including Authorization
    configuration.addAllowedHeader("*");
    configuration.addExposedHeader("Authorization");
    
    // Allow credentials
    configuration.setAllowCredentials(true);
    
    // Set max age for preflight requests
    configuration.setMaxAge(3600L);
    
    // Specific configuration for authenticated endpoints
    CorsConfiguration authConfiguration = new CorsConfiguration();
    authConfiguration.addAllowedOriginPattern("*");
    authConfiguration.addAllowedMethod("*");
    authConfiguration.addAllowedHeader("*");
    authConfiguration.addExposedHeader("Authorization");
    authConfiguration.setAllowCredentials(true);
    authConfiguration.setMaxAge(3600L);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    source.registerCorsConfiguration("/api/trips/my-trips", authConfiguration);
    source.registerCorsConfiguration("/api/trips/activities", authConfiguration);
    source.registerCorsConfiguration("/api/trips/itinerary", authConfiguration);
    source.registerCorsConfiguration("/api/trips/dashboard", authConfiguration);
    source.registerCorsConfiguration("/api/trips/*/details", authConfiguration);
    
    return source;
}
```

### 2. Security Filter Chain Configuration

CORS is now properly configured in the security filter chain:

```java
http
    .cors(cors -> cors.configurationSource(corsConfigurationSource()))
    .csrf(AbstractHttpConfigurer::disable)
    // ... rest of configuration
```

### 3. Enhanced JWT Authentication Filter

Added comprehensive logging to debug authentication issues:

```java
@Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
    
    final String authorizationHeader = request.getHeader("Authorization");
    final String requestURI = request.getRequestURI();
    final String method = request.getMethod();
    
    // Log request details for debugging
    logger.debug("Processing request: " + method + " " + requestURI + " with Authorization header: " + 
                (authorizationHeader != null ? "present" : "missing"));
    
    // ... rest of authentication logic
}
```

## Testing Steps

### 1. Test CORS Configuration

```bash
# Test basic CORS endpoint
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Authorization" \
     -X OPTIONS \
     http://localhost:9090/api/test/cors-test
```

### 2. Test JWT Token Generation

```bash
# Generate JWT token for testing
curl http://localhost:9090/api/test/jwt-token/username
```

### 3. Test Authentication

```bash
# Test authentication with JWT token
curl -H "Authorization: Bearer <your-jwt-token>" \
     http://localhost:9090/api/test/test-auth
```

### 4. Test Protected Endpoint

```bash
# Test the problematic endpoint
curl -H "Authorization: Bearer <your-jwt-token>" \
     -H "Origin: http://localhost:3000" \
     http://localhost:9090/api/trips/my-trips
```

## Browser Developer Tools Debugging

### 1. Check Network Tab
- Look for OPTIONS preflight request
- Check if it returns 200 OK with proper CORS headers
- Verify the actual request follows

### 2. Check Console for Errors
- CORS errors will appear in the console
- Look for specific error messages about missing headers

### 3. Check Request Headers
- Ensure Authorization header is being sent
- Verify Origin header is present

## Common Issues and Fixes

### Issue 1: Preflight Request Fails
**Symptoms**: OPTIONS request returns 401/403
**Fix**: Ensure OPTIONS method is allowed in CORS configuration

### Issue 2: Missing CORS Headers
**Symptoms**: Response lacks Access-Control-Allow-* headers
**Fix**: Verify CORS configuration is applied before security filters

### Issue 3: Authorization Header Not Allowed
**Symptoms**: Preflight fails due to Authorization header
**Fix**: Ensure Authorization is in allowed headers list

### Issue 4: Credentials Not Allowed
**Symptoms**: CORS error about credentials
**Fix**: Set `setAllowCredentials(true)` in CORS configuration

## Production Considerations

### 1. Restrict Origins
```java
// Instead of allowing all origins
configuration.addAllowedOriginPattern("*");

// Restrict to specific domains
configuration.addAllowedOrigin("https://yourdomain.com");
configuration.addAllowedOrigin("https://app.yourdomain.com");
```

### 2. Restrict Methods
```java
// Only allow necessary methods
configuration.addAllowedMethod("GET");
configuration.addAllowedMethod("POST");
configuration.addAllowedMethod("PUT");
configuration.addAllowedMethod("DELETE");
```

### 3. Restrict Headers
```java
// Only allow necessary headers
configuration.addAllowedHeader("Authorization");
configuration.addAllowedHeader("Content-Type");
configuration.addAllowedHeader("Accept");
```

## Additional Debugging

### 1. Enable Debug Logging
Add to `application.properties`:
```properties
logging.level.com.pv.trip_planner.security=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.springframework.web.cors=DEBUG
```

### 2. Test with Simple Client
Use a simple HTML page to test CORS:
```html
<!DOCTYPE html>
<html>
<head>
    <title>CORS Test</title>
</head>
<body>
    <h1>CORS Test</h1>
    <button onclick="testCORS()">Test CORS</button>
    <div id="result"></div>
    
    <script>
        async function testCORS() {
            try {
                const response = await fetch('http://localhost:9090/api/trips/my-trips', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE'
                    }
                });
                const data = await response.json();
                document.getElementById('result').textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('result').textContent = 'Error: ' + error.message;
            }
        }
    </script>
</body>
</html>
```

## Verification Checklist

- [ ] CORS configuration is applied before security filters
- [ ] OPTIONS method is allowed in CORS configuration
- [ ] Authorization header is allowed in CORS configuration
- [ ] Credentials are allowed in CORS configuration
- [ ] JWT token is valid and properly formatted
- [ ] User has proper authentication
- [ ] Endpoint is properly secured
- [ ] CORS headers are present in response

## Next Steps

1. **Test the endpoints** using the provided curl commands
2. **Check browser developer tools** for specific error messages
3. **Verify JWT token** is valid and contains proper claims
4. **Test with simple HTML client** to isolate the issue
5. **Check server logs** for authentication and CORS debugging information

If the issue persists, the problem might be:
- JWT token validation failing
- User not found in database
- Role-based access control issues
- Database connection problems

