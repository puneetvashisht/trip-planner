package com.pv.trip_planner.controllers;

import com.pv.trip_planner.entities.Role;
import com.pv.trip_planner.entities.User;
import com.pv.trip_planner.repositories.RoleRepository;
import com.pv.trip_planner.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class RoleController {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable Long id) {
        Role role = roleRepository.findById(id)
                .orElse(null);
        if (role != null) {
            return ResponseEntity.ok(role);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Role> createRole(@RequestBody Role role) {
        if (roleRepository.existsByName(role.getName())) {
            return ResponseEntity.badRequest().build();
        }
        Role savedRole = roleRepository.save(role);
        return ResponseEntity.ok(savedRole);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Role> updateRole(@PathVariable Long id, @RequestBody Role role) {
        Role existingRole = roleRepository.findById(id).orElse(null);
        if (existingRole == null) {
            return ResponseEntity.notFound().build();
        }
        
        existingRole.setName(role.getName());
        existingRole.setDescription(role.getDescription());
        
        Role updatedRole = roleRepository.save(existingRole);
        return ResponseEntity.ok(updatedRole);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable Long id) {
        Role role = roleRepository.findById(id).orElse(null);
        if (role == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Check if any users have this role
        List<User> usersWithRole = userRepository.findAll().stream()
                .filter(user -> user.getRoles().contains(role))
                .toList();
        
        if (!usersWithRole.isEmpty()) {
            return ResponseEntity.badRequest().body("Cannot delete role: " + usersWithRole.size() + " users have this role");
        }
        
        roleRepository.delete(role);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/assign/{roleId}")
    public ResponseEntity<?> assignRoleToUser(@PathVariable Long userId, @PathVariable Long roleId) {
        User user = userRepository.findById(userId).orElse(null);
        Role role = roleRepository.findById(roleId).orElse(null);
        
        if (user == null || role == null) {
            return ResponseEntity.notFound().build();
        }
        
        Set<Role> userRoles = user.getRoles();
        userRoles.add(role);
        user.setRoles(userRoles);
        
        userRepository.save(user);
        return ResponseEntity.ok("Role assigned successfully");
    }

    @DeleteMapping("/{userId}/remove/{roleId}")
    public ResponseEntity<?> removeRoleFromUser(@PathVariable Long userId, @PathVariable Long roleId) {
        User user = userRepository.findById(userId).orElse(null);
        Role role = roleRepository.findById(roleId).orElse(null);
        
        if (user == null || role == null) {
            return ResponseEntity.notFound().build();
        }
        
        Set<Role> userRoles = user.getRoles();
        userRoles.remove(role);
        user.setRoles(userRoles);
        
        userRepository.save(user);
        return ResponseEntity.ok("Role removed successfully");
    }
}
