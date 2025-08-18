package com.pv.trip_planner.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pv.trip_planner.entities.ItineraryItem;
import com.pv.trip_planner.entities.Trip;
import com.pv.trip_planner.repositories.ItineraryRepository;
import com.pv.trip_planner.repositories.TripRepository;


@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private ItineraryRepository itineraryItemRepository;

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public void createTrip(Trip trip) {
        tripRepository.save(trip);
    }

    public void addItineraryItemToTrip(Long tripId, ItineraryItem itineraryItem) {
        // ItineraryItem existingItem = itineraryItemRepository.findById(itineraryItem.getId())
        // .orElseThrow(() -> new RuntimeException("Itinerary item not found"));

        Trip trip = tripRepository.findById(tripId)
        .orElseThrow(() -> new RuntimeException("Trip not found"));

        trip.getItinerary().add(itineraryItem);
        tripRepository.save(trip);
    }

}
