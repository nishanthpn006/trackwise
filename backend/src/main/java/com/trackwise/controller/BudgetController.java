package com.trackwise.controller;

import com.trackwise.dto.ApiResponse;
import com.trackwise.dto.BudgetRequest;
import com.trackwise.dto.BudgetResponse;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.BudgetService;
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
 * BudgetController — REST API controller for user budget management.
 *
 * <p>All endpoints are user-scoped; the authenticated user is resolved from the
 * JWT principal on every request. No budget from another user is ever accessible.</p>
 */
@RestController
@RequestMapping({"/api/v1/budgets", "/api/budgets"})
public class BudgetController {

    private final BudgetService budgetService;
    private final UserRepository userRepository;

    public BudgetController(BudgetService budgetService, UserRepository userRepository) {
        this.budgetService = budgetService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
    }

    /** GET /api/budgets — Returns all budgets with computed spent amounts. */
    @GetMapping
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getBudgets(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getAuthenticatedUser(userDetails);
        List<BudgetResponse> budgets = budgetService.getBudgets(user);
        return ResponseEntity.ok(ApiResponse.success("Budgets retrieved successfully", budgets));
    }

    /** GET /api/budgets/{id} — Returns a single budget by ID (owner-scoped). */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BudgetResponse>> getBudgetById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id
    ) {
        User user = getAuthenticatedUser(userDetails);
        BudgetResponse budget = budgetService.getBudgetById(id, user);
        return ResponseEntity.ok(ApiResponse.success("Budget retrieved successfully", budget));
    }

    /** POST /api/budgets — Creates a new budget. */
    @PostMapping
    public ResponseEntity<ApiResponse<BudgetResponse>> createBudget(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody BudgetRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        BudgetResponse budget = budgetService.createBudget(request, user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Budget created successfully", budget));
    }

    /** PUT /api/budgets/{id} — Updates an existing budget (owner-scoped). */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BudgetResponse>> updateBudget(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id,
            @Valid @RequestBody BudgetRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        BudgetResponse budget = budgetService.updateBudget(id, request, user);
        return ResponseEntity.ok(ApiResponse.success("Budget updated successfully", budget));
    }

    /** DELETE /api/budgets/{id} — Deletes a budget (owner-scoped). */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id
    ) {
        User user = getAuthenticatedUser(userDetails);
        budgetService.deleteBudget(id, user);
        return ResponseEntity.ok(ApiResponse.success("Budget deleted successfully", null));
    }
}
