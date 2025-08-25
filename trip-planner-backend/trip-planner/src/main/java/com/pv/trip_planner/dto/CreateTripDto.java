package com.pv.trip_planner.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
public class CreateTripDto {
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private MultipartFile image;
}
