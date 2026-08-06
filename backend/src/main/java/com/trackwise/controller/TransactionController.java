package com.trackwise.controller;

import com.trackwise.dto.ApiResponse;
import com.trackwise.dto.DashboardSummaryResponse;
import com.trackwise.dto.PagedResponse;
import com.trackwise.dto.TransactionRequest;
import com.trackwise.dto.TransactionResponse;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.UUID;

/**
 * TransactionController — REST API controller for managing user transactions and dashboard metrics.
 */
@RestController
@RequestMapping({"/api/v1/transactions", "/api/transactions"})
public class TransactionController {

    private final TransactionService transactionService;
    private final UserRepository userRepository;

    public TransactionController(TransactionService transactionService, UserRepository userRepository) {
        this.transactionService = transactionService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<TransactionResponse>>> getTransactions(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        User user = getAuthenticatedUser(userDetails);
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PagedResponse<TransactionResponse> result = transactionService.getTransactions(
                user, search, categoryId, type, startDate, endDate, pageable
        );
        return ResponseEntity.ok(ApiResponse.success("Transactions retrieved successfully", result));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getDashboardSummary(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getAuthenticatedUser(userDetails);
        DashboardSummaryResponse summary = transactionService.getDashboardSummary(user);
        return ResponseEntity.ok(ApiResponse.success("Dashboard summary retrieved successfully", summary));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponse>> getTransactionById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id
    ) {
        User user = getAuthenticatedUser(userDetails);
        TransactionResponse transaction = transactionService.getTransactionById(id, user);
        return ResponseEntity.ok(ApiResponse.success("Transaction retrieved successfully", transaction));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TransactionResponse>> createTransaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TransactionRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        TransactionResponse transaction = transactionService.createTransaction(request, user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Transaction created successfully", transaction));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponse>> updateTransaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id,
            @Valid @RequestBody TransactionRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        TransactionResponse transaction = transactionService.updateTransaction(id, request, user);
        return ResponseEntity.ok(ApiResponse.success("Transaction updated successfully", transaction));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id
    ) {
        User user = getAuthenticatedUser(userDetails);
        transactionService.deleteTransaction(id, user);
        return ResponseEntity.ok(ApiResponse.success("Transaction deleted successfully", null));
    }
}
