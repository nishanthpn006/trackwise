package com.trackwise.controller;

import com.trackwise.dto.ApiResponse;
import com.trackwise.dto.DashboardAnalyticsResponse;
import com.trackwise.dto.DashboardSummaryResponse;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.AnalyticsService;
import com.trackwise.service.DashboardService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

/**
 * DashboardController — REST API controller for user dashboard metrics and financial summary overview.
 */
@RestController
@RequestMapping({"/api/v1/dashboard", "/api/dashboard"})
public class DashboardController {

    private final DashboardService dashboardService;
    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;

    public DashboardController(
            DashboardService dashboardService,
            AnalyticsService analyticsService,
            UserRepository userRepository
    ) {
        this.dashboardService = dashboardService;
        this.analyticsService = analyticsService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getDashboardSummary(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false, defaultValue = "THIS_MONTH") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        User user = getAuthenticatedUser(userDetails);
        DashboardSummaryResponse summary = dashboardService.getDashboardSummary(user, period, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Dashboard summary retrieved successfully", summary));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<DashboardAnalyticsResponse>> getDashboardAnalytics(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getAuthenticatedUser(userDetails);
        DashboardAnalyticsResponse analytics = analyticsService.getDashboardAnalytics(user);
        return ResponseEntity.ok(ApiResponse.success("Dashboard analytics retrieved successfully", analytics));
    }
}
