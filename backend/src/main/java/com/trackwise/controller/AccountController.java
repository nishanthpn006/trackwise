package com.trackwise.controller;

import com.trackwise.dto.AccountRequest;
import com.trackwise.dto.AccountResponse;
import com.trackwise.dto.ApiResponse;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.AccountService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping({"/api/v1/accounts", "/api/accounts"})
public class AccountController {

    private final AccountService accountService;
    private final UserRepository userRepository;

    public AccountController(AccountService accountService, UserRepository userRepository) {
        this.accountService = accountService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAccounts(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false, defaultValue = "false") boolean includeArchived
    ) {
        User user = getAuthenticatedUser(userDetails);
        List<AccountResponse> accounts = accountService.getAccounts(user, includeArchived);
        return ResponseEntity.ok(ApiResponse.success("Accounts retrieved successfully", accounts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccountById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id
    ) {
        User user = getAuthenticatedUser(userDetails);
        AccountResponse account = accountService.getAccountById(id, user);
        return ResponseEntity.ok(ApiResponse.success("Account retrieved successfully", account));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AccountResponse>> createAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AccountRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        AccountResponse account = accountService.createAccount(request, user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Account created successfully", account));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountResponse>> updateAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id,
            @Valid @RequestBody AccountRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        AccountResponse account = accountService.updateAccount(id, request, user);
        return ResponseEntity.ok(ApiResponse.success("Account updated successfully", account));
    }

    @PatchMapping("/{id}/archive")
    public ResponseEntity<ApiResponse<AccountResponse>> toggleArchive(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id
    ) {
        User user = getAuthenticatedUser(userDetails);
        AccountResponse account = accountService.toggleArchive(id, user);
        return ResponseEntity.ok(ApiResponse.success("Account archive state updated", account));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id
    ) {
        User user = getAuthenticatedUser(userDetails);
        accountService.deleteAccount(id, user);
        return ResponseEntity.ok(ApiResponse.success("Account deleted or archived safely", null));
    }
}
