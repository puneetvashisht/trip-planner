package com.pv.trip_planner.controllers;

import com.pv.trip_planner.entities.Role;
import com.pv.trip_planner.repositories.RoleRepository;
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
}
