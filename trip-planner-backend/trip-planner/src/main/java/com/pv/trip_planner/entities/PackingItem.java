package com.pv.trip_planner.entities;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "packing_items")
public class PackingItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private boolean isPacked;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;
}
