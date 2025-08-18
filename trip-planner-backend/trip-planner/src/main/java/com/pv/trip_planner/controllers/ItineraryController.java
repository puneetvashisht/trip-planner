package com.pv.trip_planner.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.pv.trip_planner.entities.ItineraryItem;
import com.pv.trip_planner.services.ItineraryService;

@RestController
@RequestMapping("/api/itinerary")
public class ItineraryController {

    @Autowired
    private ItineraryService itineraryService;

    @GetMapping
    public List<ItineraryItem> getAllItineraryItems() {
        return itineraryService.fetAllItineraryItems();
    }

    @PostMapping
    public void createItineraryItem(@RequestBody ItineraryItem itineraryItem) {
        itineraryService.createItineraryItem(itineraryItem);
    }

    // update itinerary item
    @PatchMapping("/{id}")
    public void updateItineraryItem(@PathVariable Long id, @RequestBody ItineraryItem itineraryItem) {
        itineraryService.updateItineraryItem(id, itineraryItem);
    }

    // delete itinerary item
}
