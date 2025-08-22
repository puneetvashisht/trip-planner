package com.pv.trip_planner.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

// import com.fasterxml.jackson.annotation.JsonIgnore;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "itinerary_items")
public class ItineraryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;
    // @ManyToOne
    // @JoinColumn(name = "trip_id", nullable = false)
    // @JsonIgnore
    // private Trip trip;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Activity> activities;
}
