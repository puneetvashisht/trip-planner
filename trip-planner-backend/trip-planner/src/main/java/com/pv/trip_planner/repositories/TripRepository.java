package com.pv.trip_planner.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pv.trip_planner.entities.Trip;

public interface TripRepository extends JpaRepository<Trip, Long> {
    
}
