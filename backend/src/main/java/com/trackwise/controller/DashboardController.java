package com.trackwise.controller;

import com.trackwise.dto.ApiResponse;
import com.trackwise.dto.DashboardAnalyticsResponse;
import com.trackwise.dto.DashboardSummaryResponse;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.AnalyticsService;
import com.trackwise.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * DashboardController — REST API controller for user dashboard metrics and summary overview.
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final TransactionService transactionService;
    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;

    public DashboardController(
            TransactionService transactionService,
            AnalyticsService analyticsService,
            UserRepository userRepository
    ) {
        this.transactionService = transactionService;
        this.analyticsService = analyticsService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getDashboardSummary(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getAuthenticatedUser(userDetails);
        DashboardSummaryResponse summary = transactionService.getDashboardSummary(user);
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

