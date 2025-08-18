package com.pv.trip_planner.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pv.trip_planner.entities.ItineraryItem;
import com.pv.trip_planner.repositories.ItineraryRepository;


@Service
public class ItineraryService {

    @Autowired
    private ItineraryRepository itineraryRepository;

    public List<ItineraryItem> fetAllItineraryItems() {
        return itineraryRepository.findAll();
    }

    public void createItineraryItem(ItineraryItem itineraryItem) {
        itineraryRepository.save(itineraryItem);
    }

    public void updateItineraryItem(Long id, ItineraryItem itineraryItem) {
        ItineraryItem existingItem = itineraryRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Itinerary item not found"));

        existingItem.setTitle(itineraryItem.getTitle());
        existingItem.setDescription(itineraryItem.getDescription());
        existingItem.setStartTime(itineraryItem.getStartTime());
        existingItem.setEndTime(itineraryItem.getEndTime());
        existingItem.setLocation(itineraryItem.getLocation());

        itineraryRepository.save(existingItem);
    }

}
