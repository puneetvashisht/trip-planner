package com.pv.trip_planner.dto;

import com.pv.trip_planner.entities.Activity;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponseDto {
    private Long id;
    private String title;
    private String description;
    private String location;
    private LocalTime startTime;
    private LocalTime endTime;

    public static ActivityResponseDto fromActivity(Activity activity) {
        return ActivityResponseDto.builder()
                .id(activity.getId())
                .title(activity.getTitle())
                .description(activity.getDescription())
                .location(activity.getLocation())
                .startTime(activity.getStartTime())
                .endTime(activity.getEndTime())
                .build();
    }
}
