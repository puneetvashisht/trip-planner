package com.pv.trip_planner.dto;

import com.pv.trip_planner.entities.Trip;
import com.pv.trip_planner.entities.User;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripResponseDto {
    private Long id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String imageUrl;
    private UserDto owner;
    private List<UserDto> collaborators;
    private List<ItineraryItemResponseDto> itinerary;
    private List<BudgetItemDto> budgetItems;
    private List<PackingItemDto> packingList;
    private List<DestinationDto> destinations;

    public static TripResponseDto fromTrip(Trip trip) {
        return TripResponseDto.builder()
                .id(trip.getId())
                .title(trip.getTitle())
                .description(trip.getDescription())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .imageUrl(trip.getImageUrl())
                .owner(UserDto.fromUser(trip.getOwner()))
                .collaborators(trip.getCollaborators() != null ? 
                    trip.getCollaborators().stream()
                        .map(UserDto::fromUser)
                        .collect(Collectors.toList()) : null)
                .itinerary(trip.getItinerary() != null ? 
                    trip.getItinerary().stream()
                        .map(ItineraryItemResponseDto::fromItineraryItem)
                        .collect(Collectors.toList()) : null)
                .budgetItems(trip.getBudgetItems() != null ? 
                    trip.getBudgetItems().stream()
                        .map(BudgetItemDto::fromBudgetItem)
                        .collect(Collectors.toList()) : null)
                .packingList(trip.getPackingList() != null ? 
                    trip.getPackingList().stream()
                        .map(PackingItemDto::fromPackingItem)
                        .collect(Collectors.toList()) : null)
                .destinations(trip.getDestinations() != null ? 
                    trip.getDestinations().stream()
                        .map(DestinationDto::fromDestination)
                        .collect(Collectors.toList()) : null)
                .build();
    }
}
