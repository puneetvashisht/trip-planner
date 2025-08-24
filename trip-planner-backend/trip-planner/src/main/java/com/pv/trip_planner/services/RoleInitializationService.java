package com.pv.trip_planner.services;

import com.pv.trip_planner.entities.Role;
import com.pv.trip_planner.entities.User;
import com.pv.trip_planner.repositories.RoleRepository;
import com.pv.trip_planner.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class RoleInitializationService implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(RoleInitializationService.class);

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            logger.info("Starting role and user initialization...");
            initializeRoles();
            initializeAdminUser();
            logger.info("Role and user initialization completed successfully");
        } catch (Exception e) {
            logger.error("Error during role and user initialization: {}", e.getMessage(), e);
            // Don't throw the exception to prevent application startup failure
        }
    }

    private void initializeRoles() {
        logger.info("Initializing default roles...");
        // Create default roles if they don't exist
        for (Role.RoleType roleType : Role.RoleType.values()) {
            if (!roleRepository.existsByName(roleType)) {
                logger.info("Creating role: {}", roleType.name());
                Role role = Role.builder()
                        .name(roleType)
                        .description("Default " + roleType.name().toLowerCase() + " role")
                        .build();
                roleRepository.save(role);
                logger.info("Role {} created successfully", roleType.name());
            } else {
                logger.info("Role {} already exists", roleType.name());
            }
        }
        logger.info("Role initialization completed");
    }

    private void initializeAdminUser() {
        logger.info("Initializing admin user...");
        // Create admin user if it doesn't exist
        if (!userRepository.existsByUsername("admin")) {
            logger.info("Creating admin user...");
            Role adminRole = roleRepository.findByName(Role.RoleType.ADMIN)
                    .orElseThrow(() -> new RuntimeException("Admin role not found"));

            Set<Role> adminRoles = new HashSet<>();
            adminRoles.add(adminRole);

            User adminUser = User.builder()
                    .username("admin")
                    .email("admin@tripplanner.com")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(adminRoles)
                    .build();

            userRepository.save(adminUser);
            logger.info("Admin user created successfully");
        } else {
            logger.info("Admin user already exists");
        }
        logger.info("Admin user initialization completed");
    }
}
