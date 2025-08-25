package com.pv.trip_planner.dto;

import com.pv.trip_planner.entities.User;
import com.pv.trip_planner.entities.Role;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private Set<String> roles;

    public static UserDto fromUser(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(user.getRoles() != null ? 
                    user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toSet()) : null)
                .build();
    }
}
