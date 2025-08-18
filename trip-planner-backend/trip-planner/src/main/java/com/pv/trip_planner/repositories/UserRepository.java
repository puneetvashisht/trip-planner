package com.pv.trip_planner.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pv.trip_planner.entities.User;

public interface UserRepository extends JpaRepository<User, Integer> {

}
