package com.trackwise.controller;

import com.trackwise.dto.ApiResponse;
import com.trackwise.dto.SubscriptionRequest;
import com.trackwise.dto.SubscriptionResponse;
import com.trackwise.dto.SubscriptionSummaryResponse;
import com.trackwise.entity.SubscriptionStatus;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.SubscriptionService;
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
@RequestMapping({"/api/v1/subscriptions", "/api/subscriptions"})
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final UserRepository userRepository;

    public SubscriptionController(SubscriptionService subscriptionService, UserRepository userRepository) {
        this.subscriptionService = subscriptionService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SubscriptionResponse>>> getSubscriptions(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) SubscriptionStatus status
    ) {
        User user = getAuthenticatedUser(userDetails);
        List<SubscriptionResponse> list = subscriptionService.getSubscriptions(user, status);
        return ResponseEntity.ok(ApiResponse.success("Subscriptions retrieved", list));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<SubscriptionSummaryResponse>> getSummary(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getAuthenticatedUser(userDetails);
        SubscriptionSummaryResponse summary = subscriptionService.getSummary(user);
        return ResponseEntity.ok(ApiResponse.success("Subscription summary retrieved", summary));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> getSubscriptionById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id
    ) {
        User user = getAuthenticatedUser(userDetails);
        SubscriptionResponse resp = subscriptionService.getSubscriptionById(id, user);
        return ResponseEntity.ok(ApiResponse.success("Subscription retrieved", resp));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SubscriptionResponse>> createSubscription(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SubscriptionRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        SubscriptionResponse resp = subscriptionService.createSubscription(request, user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Subscription created successfully", resp));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> updateSubscription(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id,
            @Valid @RequestBody SubscriptionRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        SubscriptionResponse resp = subscriptionService.updateSubscription(id, request, user);
        return ResponseEntity.ok(ApiResponse.success("Subscription updated successfully", resp));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> updateStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id,
            @RequestParam SubscriptionStatus status
    ) {
        User user = getAuthenticatedUser(userDetails);
        SubscriptionResponse resp = subscriptionService.updateStatus(id, status, user);
        return ResponseEntity.ok(ApiResponse.success("Subscription status updated", resp));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSubscription(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id
    ) {
        User user = getAuthenticatedUser(userDetails);
        subscriptionService.deleteSubscription(id, user);
        return ResponseEntity.ok(ApiResponse.success("Subscription deleted successfully", null));
    }
}
