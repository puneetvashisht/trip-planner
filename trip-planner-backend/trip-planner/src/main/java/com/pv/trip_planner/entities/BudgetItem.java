package com.pv.trip_planner.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "budget_items")
public class BudgetItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private BigDecimal amount;
    private String category;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;
}
