package com.pv.trip_planner.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "trips")
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToMany
    @JoinTable(
        name = "trip_collaborators",
        joinColumns = @JoinColumn(name = "trip_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> collaborators;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItineraryItem> itinerary;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BudgetItem> budgetItems;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PackingItem> packingList;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Destination> destinations;
}
