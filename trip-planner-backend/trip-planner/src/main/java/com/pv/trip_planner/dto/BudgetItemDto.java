package com.pv.trip_planner.dto;

import com.pv.trip_planner.entities.BudgetItem;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetItemDto {
    private Long id;
    private String description;
    private BigDecimal amount;
    private String category;

    public static BudgetItemDto fromBudgetItem(BudgetItem item) {
        return BudgetItemDto.builder()
                .id(item.getId())
                .description(item.getDescription())
                .amount(item.getAmount())
                .category(item.getCategory())
                .build();
    }
}
