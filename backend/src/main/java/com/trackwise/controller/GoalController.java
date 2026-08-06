package com.trackwise.controller;

import com.trackwise.dto.ApiResponse;
import com.trackwise.dto.GoalContributionRequest;
import com.trackwise.dto.GoalRequest;
import com.trackwise.dto.GoalResponse;
import com.trackwise.dto.GoalSummaryResponse;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * GoalController — REST API controller for savings goal management.
 * All endpoints are scoped strictly to the authenticated user.
 */
@RestController
@RequestMapping({"/api/v1/goals", "/api/goals"})
public class GoalController {

    private final GoalService goalService;
    private final UserRepository userRepository;

    public GoalController(GoalService goalService, UserRepository userRepository) {
        this.goalService = goalService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
    }

    /** GET /api/goals — Returns all savings goals for the user */
    @GetMapping
    public ResponseEntity<ApiResponse<List<GoalResponse>>> getGoals(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getAuthenticatedUser(userDetails);
        List<GoalResponse> goals = goalService.getGoals(user);
        return ResponseEntity.ok(ApiResponse.success("Savings goals retrieved successfully", goals));
    }

    /** GET /api/goals/summary — Returns KPI summary stats for savings goals */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<GoalSummaryResponse>> getGoalSummary(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getAuthenticatedUser(userDetails);
        GoalSummaryResponse summary = goalService.getGoalSummary(user);
        return ResponseEntity.ok(ApiResponse.success("Savings goals summary retrieved successfully", summary));
    }

    /** GET /api/goals/{id} — Returns a single goal by ID */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GoalResponse>> getGoalById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id
    ) {
        User user = getAuthenticatedUser(userDetails);
        GoalResponse goal = goalService.getGoalById(id, user);
        return ResponseEntity.ok(ApiResponse.success("Savings goal retrieved successfully", goal));
    }

    /** POST /api/goals — Creates a new savings goal */
    @PostMapping
    public ResponseEntity<ApiResponse<GoalResponse>> createGoal(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody GoalRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        GoalResponse goal = goalService.createGoal(request, user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Savings goal created successfully", goal));
    }

    /** PUT /api/goals/{id} — Updates an existing savings goal */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GoalResponse>> updateGoal(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id,
            @Valid @RequestBody GoalRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        GoalResponse goal = goalService.updateGoal(id, request, user);
        return ResponseEntity.ok(ApiResponse.success("Savings goal updated successfully", goal));
    }

    /** DELETE /api/goals/{id} — Deletes a savings goal */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGoal(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id
    ) {
        User user = getAuthenticatedUser(userDetails);
        goalService.deleteGoal(id, user);
        return ResponseEntity.ok(ApiResponse.success("Savings goal deleted successfully", null));
    }

    /** POST /api/goals/{id}/contributions — Adds a contribution/savings deposit to a goal */
    @PostMapping("/{id}/contributions")
    public ResponseEntity<ApiResponse<GoalResponse>> addContribution(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id,
            @Valid @RequestBody GoalContributionRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        GoalResponse goal = goalService.addContribution(id, request, user);
        return ResponseEntity.ok(ApiResponse.success("Contribution added successfully", goal));
    }
}
