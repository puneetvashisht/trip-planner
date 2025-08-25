package com.pv.trip_planner.dto;

import com.pv.trip_planner.entities.Destination;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DestinationDto {
    private Long id;
    private String name;
    private String description;
    private LocalDate arrivalDate;
    private LocalDate departureDate;
    private String location;

    public static DestinationDto fromDestination(Destination destination) {
        return DestinationDto.builder()
                .id(destination.getId())
                .name(destination.getName())
                .description(destination.getDescription())
                .arrivalDate(destination.getArrivalDate())
                .departureDate(destination.getDepartureDate())
                .location(destination.getLocation())
                .build();
    }
}
