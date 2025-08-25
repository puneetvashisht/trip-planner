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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.pv.trip_planner.dto.ActivityResponseDto;
import com.pv.trip_planner.dto.ItineraryItemResponseDto;
import com.pv.trip_planner.dto.TripResponseDto;
import com.pv.trip_planner.dto.UserDashboardDto;
import com.pv.trip_planner.entities.ItineraryItem;
import com.pv.trip_planner.entities.Trip;
import com.pv.trip_planner.services.TripService;

import java.io.IOException;
import java.time.LocalDate;
import java.nio.file.Path;
import java.nio.file.Paths;

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

    @GetMapping("/my-trips")
    public List<TripResponseDto> getMyTrips() {
        return tripService.getAllTripsForCurrentUser();
    }

    @GetMapping("/{tripId}")
    public Trip getTripById(@PathVariable Long tripId) {
        return tripService.getTripById(tripId);
    }

    @GetMapping("/{tripId}/details")
    public TripResponseDto getTripDetailsById(@PathVariable Long tripId) {
        return tripService.getTripByIdForCurrentUser(tripId);
    }

    @GetMapping("/activities")
    public List<ActivityResponseDto> getAllActivities() {
        return tripService.getAllActivitiesForCurrentUser();
    }

    @GetMapping("/itinerary")
    public List<ItineraryItemResponseDto> getAllItineraryItems() {
        return tripService.getAllItineraryItemsForCurrentUser();
    }

    @GetMapping("/dashboard")
    public UserDashboardDto getUserDashboard() {
        return tripService.getUserDashboard();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createTrip(@RequestBody Trip trip) {
         tripService.createTrip(trip);
    }

    @PostMapping("/create-with-image")
    @ResponseStatus(HttpStatus.CREATED)
    public void createTripWithImage(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
        
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        
        tripService.createTripWithImage(title, description, start, end, image);
    }

    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            Path imagePath = Paths.get("./uploads/trips").resolve(filename);
            Resource resource = new UrlResource(imagePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG) // Default to JPEG, you can make this dynamic
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // add itinerary item to trip
    @PostMapping("/{tripId}/itinerary")
    public void addItineraryItemToTrip(@PathVariable Long tripId, @RequestBody ItineraryItem itineraryItem) {
        tripService.addItineraryItemToTrip(tripId, itineraryItem);
    }
}
