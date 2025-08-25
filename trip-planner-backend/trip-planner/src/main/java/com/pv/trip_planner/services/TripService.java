package com.pv.trip_planner.services;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pv.trip_planner.dto.ActivityResponseDto;
import com.pv.trip_planner.dto.ItineraryItemResponseDto;
import com.pv.trip_planner.dto.TripResponseDto;
import com.pv.trip_planner.dto.UserDashboardDto;
import com.pv.trip_planner.dto.UserDto;
import com.pv.trip_planner.entities.ItineraryItem;
import com.pv.trip_planner.entities.Trip;
import com.pv.trip_planner.entities.User;
import com.pv.trip_planner.repositories.ItineraryRepository;
import com.pv.trip_planner.repositories.TripRepository;
import com.pv.trip_planner.security.SecurityUtils;
import com.pv.trip_planner.services.FileStorageService;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private ItineraryRepository itineraryItemRepository;

    @Autowired
    private SecurityUtils securityUtils;

    @Autowired
    private FileStorageService fileStorageService;

    public List<TripResponseDto> getAllTripsForCurrentUser() {
        User currentUser = securityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }

        List<Trip> trips;
        if (securityUtils.isAdmin(currentUser)) {
            // Admin can see all trips
            trips = tripRepository.findAll();
        } else {
            // Regular users can only see trips they own or collaborate on
            trips = tripRepository.findByOwnerOrCollaboratorsContaining(currentUser);
        }

        return trips.stream()
                .map(TripResponseDto::fromTrip)
                .collect(Collectors.toList());
    }

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public void createTrip(Trip trip) {
        tripRepository.save(trip);
    }

    public void createTripWithImage(String title, String description, LocalDate startDate, LocalDate endDate, MultipartFile image) throws IOException {
        // Validate image file
        if (image != null && !fileStorageService.isValidImageFile(image)) {
            throw new RuntimeException("Invalid image file. Please upload a valid image.");
        }

        // Get current user
        User currentUser = securityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }

        // Store image if provided
        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = fileStorageService.storeFile(image);
        }

        // Create trip
        Trip trip = Trip.builder()
                .title(title)
                .description(description)
                .startDate(startDate)
                .endDate(endDate)
                .imageUrl(imageUrl)
                .owner(currentUser)
                .build();

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

    public TripResponseDto getTripByIdForCurrentUser(Long tripId) {
        User currentUser = securityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        // Check if user has access to this trip
        if (!securityUtils.isAdmin(currentUser) && 
            !trip.getOwner().equals(currentUser) && 
            !trip.getCollaborators().contains(currentUser)) {
            throw new RuntimeException("Access denied: You don't have permission to view this trip");
        }

        return TripResponseDto.fromTrip(trip);
    }

    public List<ActivityResponseDto> getAllActivitiesForCurrentUser() {
        User currentUser = securityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }

        List<Trip> accessibleTrips;
        if (securityUtils.isAdmin(currentUser)) {
            // Admin can see all trips and their activities
            accessibleTrips = tripRepository.findAll();
        } else {
            // Regular users can only see trips they own or collaborate on
            accessibleTrips = tripRepository.findByOwnerOrCollaboratorsContaining(currentUser);
        }

        return accessibleTrips.stream()
                .flatMap(trip -> trip.getItinerary().stream())
                .flatMap(item -> item.getActivities().stream())
                .map(ActivityResponseDto::fromActivity)
                .collect(Collectors.toList());
    }

    public List<ItineraryItemResponseDto> getAllItineraryItemsForCurrentUser() {
        User currentUser = securityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }

        List<Trip> accessibleTrips;
        if (securityUtils.isAdmin(currentUser)) {
            // Admin can see all trips and their itinerary items
            accessibleTrips = tripRepository.findAll();
        } else {
            // Regular users can only see trips they own or collaborate on
            accessibleTrips = tripRepository.findByOwnerOrCollaboratorsContaining(currentUser);
        }

        return accessibleTrips.stream()
                .flatMap(trip -> trip.getItinerary().stream())
                .map(ItineraryItemResponseDto::fromItineraryItem)
                .collect(Collectors.toList());
    }

    public UserDashboardDto getUserDashboard() {
        User currentUser = securityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }

        boolean isAdmin = securityUtils.isAdmin(currentUser);
        List<TripResponseDto> trips = getAllTripsForCurrentUser();
        List<ItineraryItemResponseDto> itineraryItems = getAllItineraryItemsForCurrentUser();
        List<ActivityResponseDto> activities = getAllActivitiesForCurrentUser();

        return UserDashboardDto.builder()
                .user(UserDto.fromUser(currentUser))
                .trips(trips)
                .itineraryItems(itineraryItems)
                .activities(activities)
                .isAdmin(isAdmin)
                .build();
    }

    public Trip getTripById(Long tripId) {
       return tripRepository.findById(tripId)
       .orElseThrow(() -> new RuntimeException("Trip not found"));
    }

}
