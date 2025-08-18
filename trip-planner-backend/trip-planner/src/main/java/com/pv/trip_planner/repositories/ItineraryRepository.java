package com.pv.trip_planner.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pv.trip_planner.entities.ItineraryItem;


public interface ItineraryRepository extends JpaRepository<ItineraryItem, Long> {
    
}
