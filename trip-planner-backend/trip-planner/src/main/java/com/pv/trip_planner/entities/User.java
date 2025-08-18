package com.pv.trip_planner.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String password;

    // @OneToMany(mappedBy = "owner")
    // private Set<Trip> ownedTrips;

    // @ManyToMany(mappedBy = "collaborators")
    // private Set<Trip> collaboratedTrips;
}
