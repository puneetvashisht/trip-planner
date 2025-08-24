package com.pv.trip_planner.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pv.trip_planner.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {

    java.util.Optional<User> findByUsername(String username);
    
    java.util.Optional<User> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
}
