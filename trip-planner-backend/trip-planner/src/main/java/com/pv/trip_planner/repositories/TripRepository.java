package com.pv.trip_planner.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pv.trip_planner.entities.Trip;
import com.pv.trip_planner.entities.User;

public interface TripRepository extends JpaRepository<Trip, Long> {
    
    @Query("SELECT t FROM Trip t WHERE t.owner = :user OR :user MEMBER OF t.collaborators")
    List<Trip> findByOwnerOrCollaboratorsContaining(@Param("user") User user);
}
