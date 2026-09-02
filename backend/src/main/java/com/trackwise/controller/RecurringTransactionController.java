package com.trackwise.controller;

import com.trackwise.dto.ApiResponse;
import com.trackwise.dto.RecurringTransactionRequest;
import com.trackwise.dto.RecurringTransactionResponse;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.RecurringTransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping({"/api/v1/recurring-transactions", "/api/recurring-transactions"})
public class RecurringTransactionController {

    private final RecurringTransactionService recurringTransactionService;
    private final UserRepository userRepository;

    public RecurringTransactionController(RecurringTransactionService recurringTransactionService,
                                        UserRepository userRepository) {
        this.recurringTransactionService = recurringTransactionService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RecurringTransactionResponse>>> getRecurringTransactions(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getAuthenticatedUser(userDetails);
        List<RecurringTransactionResponse> list = recurringTransactionService.getRecurringTransactions(user);
        return ResponseEntity.ok(ApiResponse.success("Recurring transactions retrieved", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RecurringTransactionResponse>> getRecurringTransactionById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id
    ) {
        User user = getAuthenticatedUser(userDetails);
        RecurringTransactionResponse resp = recurringTransactionService.getRecurringTransactionById(id, user);
        return ResponseEntity.ok(ApiResponse.success("Recurring transaction retrieved", resp));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RecurringTransactionResponse>> createRecurringTransaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody RecurringTransactionRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        RecurringTransactionResponse resp = recurringTransactionService.createRecurringTransaction(request, user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Recurring transaction created", resp));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RecurringTransactionResponse>> updateRecurringTransaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id,
            @Valid @RequestBody RecurringTransactionRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        RecurringTransactionResponse resp = recurringTransactionService.updateRecurringTransaction(id, request, user);
        return ResponseEntity.ok(ApiResponse.success("Recurring transaction updated", resp));
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<RecurringTransactionResponse>> toggleActive(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id
    ) {
        User user = getAuthenticatedUser(userDetails);
        RecurringTransactionResponse resp = recurringTransactionService.toggleActive(id, user);
        return ResponseEntity.ok(ApiResponse.success("Recurring transaction status updated", resp));
    }

    @PostMapping("/process")
    public ResponseEntity<ApiResponse<List<RecurringTransactionResponse>>> processDue(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getAuthenticatedUser(userDetails);
        List<RecurringTransactionResponse> processed = recurringTransactionService.processDueForUser(user);
        return ResponseEntity.ok(ApiResponse.success("Due recurring transactions processed", processed));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRecurringTransaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id
    ) {
        User user = getAuthenticatedUser(userDetails);
        recurringTransactionService.deleteRecurringTransaction(id, user);
        return ResponseEntity.ok(ApiResponse.success("Recurring transaction deleted", null));
    }
}
