package com.pv.trip_planner.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow all origins for development (you can restrict this in production)
        configuration.addAllowedOriginPattern("*");
        
        // Allow common HTTP methods including OPTIONS for preflight
        configuration.addAllowedMethod("GET");
        configuration.addAllowedMethod("POST");
        configuration.addAllowedMethod("PUT");
        configuration.addAllowedMethod("DELETE");
        configuration.addAllowedMethod("PATCH");
        configuration.addAllowedMethod("OPTIONS");
        
        // Allow all headers including Authorization
        configuration.addAllowedHeader("*");
        configuration.addExposedHeader("Authorization");
        
        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);
        
        // Set max age for preflight requests
        configuration.setMaxAge(3600L);
        
        // Add specific CORS configuration for authenticated endpoints
        CorsConfiguration authConfiguration = new CorsConfiguration();
        authConfiguration.addAllowedOriginPattern("*");
        authConfiguration.addAllowedMethod("*");
        authConfiguration.addAllowedHeader("*");
        authConfiguration.addExposedHeader("Authorization");
        authConfiguration.setAllowCredentials(true);
        authConfiguration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        source.registerCorsConfiguration("/api/trips/my-trips", authConfiguration);
        source.registerCorsConfiguration("/api/trips/activities", authConfiguration);
        source.registerCorsConfiguration("/api/trips/itinerary", authConfiguration);
        source.registerCorsConfiguration("/api/trips/dashboard", authConfiguration);
        source.registerCorsConfiguration("/api/trips/*/details", authConfiguration);
        source.registerCorsConfiguration("/api/trips/images/**", configuration);
        
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/trips").permitAll()
                .requestMatchers("/api/trips/images/**").permitAll()
                .requestMatchers("/api/trips/my-trips").authenticated()
                .requestMatchers("/api/trips/activities").authenticated()
                .requestMatchers("/api/trips/itinerary").authenticated()
                .requestMatchers("/api/trips/dashboard").authenticated()
                .requestMatchers("/api/trips/{tripId}").permitAll()
                .requestMatchers("/api/trips/{tripId}/details").authenticated()
                .requestMatchers("/api/trips/{tripId}/itinerary").permitAll()
                .requestMatchers("/api/itinerary/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers("/api/test/roles-info").permitAll()
                .requestMatchers("/api/test/jwt-token/{username}").permitAll()
                .requestMatchers("/api/test/cors-test").permitAll()
                .requestMatchers("/api/test/test-auth").authenticated()
                .requestMatchers("/api/test/admin").hasRole("ADMIN")
                .requestMatchers("/api/test/moderator").hasAnyRole("ADMIN", "MODERATOR")
                .requestMatchers("/api/test/user").hasAnyRole("ADMIN", "MODERATOR", "USER")
                .anyRequest().authenticated()
            )
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
