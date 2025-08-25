package com.pv.trip_planner.security;

import com.pv.trip_planner.entities.Role;
import com.pv.trip_planner.entities.User;
import com.pv.trip_planner.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class SecurityUtils {

    @Autowired
    private UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            if (authentication.getPrincipal() instanceof CustomUserDetails) {
                return ((CustomUserDetails) authentication.getPrincipal()).getUser();
            } else {
                // Fallback to database lookup if not using CustomUserDetails
                String username = authentication.getName();
                return userRepository.findByUsername(username).orElse(null);
            }
        }
        return null;
    }

    public boolean isAdmin(User user) {
        if (user == null || user.getRoles() == null) {
            return false;
        }
        return user.getRoles().stream()
                .anyMatch(role -> Role.RoleType.ADMIN.equals(role.getName()));
    }

    public boolean isAdmin() {
        User currentUser = getCurrentUser();
        return isAdmin(currentUser);
    }

    public boolean hasRole(User user, Role.RoleType roleType) {
        if (user == null || user.getRoles() == null) {
            return false;
        }
        return user.getRoles().stream()
                .anyMatch(role -> roleType.equals(role.getName()));
    }

    public boolean hasRole(Role.RoleType roleType) {
        User currentUser = getCurrentUser();
        return hasRole(currentUser, roleType);
    }

    public String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return null;
    }

    public Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            if (authentication.getPrincipal() instanceof CustomUserDetails) {
                return ((CustomUserDetails) authentication.getPrincipal()).getUserId();
            }
        }
        return null;
    }
}
