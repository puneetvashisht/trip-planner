package com.pv.trip_planner.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "destinations")
public class Destination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private LocalDate arrivalDate;
    private LocalDate departureDate;
    private String location;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;
}
