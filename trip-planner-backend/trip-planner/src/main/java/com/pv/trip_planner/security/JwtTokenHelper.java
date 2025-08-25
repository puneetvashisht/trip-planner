package com.pv.trip_planner.security;

import com.pv.trip_planner.entities.User;
import com.pv.trip_planner.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenHelper {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserRepository userRepository;

    /**
     * Generate a JWT token for a user with user ID included in claims
     */
    public String generateTokenForUser(User user) {
        CustomUserDetails userDetails = new CustomUserDetails(user);
        return jwtTokenUtil.generateToken(userDetails);
    }

    /**
     * Generate a refresh token for a user with user ID included in claims
     */
    public String generateRefreshTokenForUser(User user) {
        CustomUserDetails userDetails = new CustomUserDetails(user);
        return jwtTokenUtil.generateRefreshToken(userDetails);
    }

    /**
     * Extract user information from a JWT token
     */
    public Map<String, Object> extractUserInfoFromToken(String token) {
        Map<String, Object> userInfo = new HashMap<>();
        
        try {
            Long userId = jwtTokenUtil.extractUserId(token);
            String username = jwtTokenUtil.extractUsername(token);
            
            userInfo.put("userId", userId);
            userInfo.put("username", username);
            userInfo.put("valid", true);
            
            // Optionally fetch additional user details from database
            if (userId != null) {
                userRepository.findById(userId).ifPresent(user -> {
                    userInfo.put("email", user.getEmail());
                    userInfo.put("roles", user.getRoles().stream()
                            .map(role -> role.getName().name())
                            .toList());
                });
            }
            
        } catch (Exception e) {
            userInfo.put("valid", false);
            userInfo.put("error", e.getMessage());
        }
        
        return userInfo;
    }

    /**
     * Validate token and return user if valid
     */
    public User getUserFromToken(String token) {
        try {
            if (jwtTokenUtil.validateToken(token)) {
                Long userId = jwtTokenUtil.extractUserId(token);
                return userRepository.findById(userId).orElse(null);
            }
        } catch (Exception e) {
            // Token is invalid
        }
        return null;
    }

    /**
     * Check if a token contains a specific user ID
     */
    public boolean isTokenForUser(String token, Long userId) {
        try {
            Long tokenUserId = jwtTokenUtil.extractUserId(token);
            return userId.equals(tokenUserId);
        } catch (Exception e) {
            return false;
        }
    }
}
