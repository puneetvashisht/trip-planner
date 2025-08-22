package com.pv.trip_planner.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.pv.trip_planner.entities.ItineraryItem;
import com.pv.trip_planner.entities.Trip;
import com.pv.trip_planner.services.TripService;

@RestController
@CrossOrigin
@RequestMapping("/api/trips")
public class TripController {

    @Autowired
    TripService tripService;

    
    @GetMapping
    public List<Trip> getAllTrips() {
        return tripService.getAllTrips();
    }

    @GetMapping("/{tripId}")
    public Trip getTripById(@PathVariable Long tripId) {
        return tripService.getTripById(tripId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createTrip(@RequestBody Trip trip) {
         tripService.createTrip(trip);
    }

    // add itinerary item to trip
    @PostMapping("/{tripId}/itinerary")
    public void addItineraryItemToTrip(@PathVariable Long tripId, @RequestBody ItineraryItem itineraryItem) {
        tripService.addItineraryItemToTrip(tripId, itineraryItem);
    }
}
