package com.pv.trip_planner.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDashboardDto {
    private UserDto user;
    private List<TripResponseDto> trips;
    private List<ItineraryItemResponseDto> itineraryItems;
    private List<ActivityResponseDto> activities;
    private boolean isAdmin;
}
