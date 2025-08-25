package com.pv.trip_planner.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.pv.trip_planner.entities.Activity;
import com.pv.trip_planner.entities.ItineraryItem;
import com.pv.trip_planner.services.ItineraryService;

@RestController
@CrossOrigin
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

    // add activity to itinerary item
    @PostMapping("/{id}/activities")
    public void addActivityToItineraryItem(@PathVariable Long id, @RequestBody Activity activity) {
        itineraryService.addActivityToItineraryItem(id, activity);
    }

    @DeleteMapping("/{id}/activities/{activityId}")
    public void deleteActivityFromItineraryItem(@PathVariable Long id, @PathVariable Long activityId) {
        itineraryService.deleteActivityFromItineraryItem(id, activityId);
    }

    @PatchMapping("/{id}/activities/{activityId}")
    public void updateActivityInItineraryItem(@PathVariable Long id, @PathVariable Long activityId, @RequestBody Activity activity) {
        itineraryService.updateActivityInItineraryItem(id, activityId, activity);
    }

    // delete itinerary item
    @DeleteMapping("/{id}")
    public void deleteItineraryItem(@PathVariable Long id) {
        // itineraryService.deleteItineraryItem(id);
    }

}
