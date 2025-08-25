package com.pv.trip_planner.controllers;

import com.pv.trip_planner.entities.Role;
import com.pv.trip_planner.entities.User;
import com.pv.trip_planner.repositories.RoleRepository;
import com.pv.trip_planner.repositories.UserRepository;
import com.pv.trip_planner.security.CustomUserDetails;
import com.pv.trip_planner.security.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @GetMapping("/public")
    public Map<String, String> publicEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "This is a public endpoint - no authentication required");
        response.put("status", "success");
        return response;
    }

    @GetMapping("/protected")
    public Map<String, Object> protectedEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "This is a protected endpoint - authentication required");
        response.put("status", "success");
        response.put("authenticatedUser", authentication.getName());
        response.put("authorities", authentication.getAuthorities());
        
        return response;
    }

    @GetMapping("/admin")
    public Map<String, String> adminEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "This is an admin endpoint - admin role required");
        response.put("status", "success");
        return response;
    }

    @GetMapping("/moderator")
    public Map<String, String> moderatorEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "This is a moderator endpoint - moderator role required");
        response.put("status", "success");
        return response;
    }

    @GetMapping("/user")
    public Map<String, String> userEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "This is a user endpoint - user role required");
        response.put("status", "success");
        return response;
    }

    @GetMapping("/roles-info")
    public Map<String, Object> rolesInfo() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Role> roles = roleRepository.findAll();
            response.put("status", "success");
            response.put("message", "Roles retrieved successfully");
            response.put("rolesCount", roles.size());
            response.put("roles", roles.stream().map(Role::getName).toList());
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error retrieving roles: " + e.getMessage());
        }
        return response;
    }

    @GetMapping("/jwt-token/{username}")
    public Map<String, Object> generateJwtToken(@PathVariable String username) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));
            
            CustomUserDetails userDetails = new CustomUserDetails(user);
            String token = jwtTokenUtil.generateToken(userDetails);
            String refreshToken = jwtTokenUtil.generateRefreshToken(userDetails);
            
            // Extract claims to verify user ID is included
            Long userId = jwtTokenUtil.extractUserId(token);
            String extractedUsername = jwtTokenUtil.extractUsername(token);
            
            response.put("status", "success");
            response.put("message", "JWT token generated successfully");
            response.put("token", token);
            response.put("refreshToken", refreshToken);
            response.put("user", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "roles", user.getRoles().stream().map(Role::getName).toList()
            ));
            response.put("tokenInfo", Map.of(
                "userId", userId,
                "username", extractedUsername,
                "expiresIn", "24 hours"
            ));
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error generating JWT token: " + e.getMessage());
        }
        return response;
    }

    @GetMapping("/test-auth")
    public Map<String, Object> testAuthentication() {
        Map<String, Object> response = new HashMap<>();
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication != null && authentication.isAuthenticated()) {
                response.put("status", "success");
                response.put("message", "Authentication successful");
                response.put("authenticatedUser", authentication.getName());
                response.put("authorities", authentication.getAuthorities());
                
                if (authentication.getPrincipal() instanceof CustomUserDetails) {
                    CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
                    response.put("userId", userDetails.getUserId());
                    response.put("userDetails", "CustomUserDetails");
                } else {
                    response.put("userDetails", "Standard UserDetails");
                }
            } else {
                response.put("status", "error");
                response.put("message", "Not authenticated");
            }
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error testing authentication: " + e.getMessage());
        }
        return response;
    }

    @GetMapping("/cors-test")
    public Map<String, Object> corsTest() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "CORS test endpoint working");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}
