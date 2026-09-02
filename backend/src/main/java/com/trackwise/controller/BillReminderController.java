package com.trackwise.controller;

import com.trackwise.dto.ApiResponse;
import com.trackwise.dto.BillReminderRequest;
import com.trackwise.dto.BillReminderResponse;
import com.trackwise.entity.BillStatus;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.BillReminderService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping({"/api/v1/bill-reminders", "/api/bill-reminders"})
public class BillReminderController {

    private final BillReminderService billReminderService;
    private final UserRepository userRepository;

    public BillReminderController(BillReminderService billReminderService, UserRepository userRepository) {
        this.billReminderService = billReminderService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BillReminderResponse>>> getBillReminders(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) BillStatus status
    ) {
        User user = getAuthenticatedUser(userDetails);
        List<BillReminderResponse> list = billReminderService.getBillReminders(user, status);
        return ResponseEntity.ok(ApiResponse.success("Bill reminders retrieved", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BillReminderResponse>> getBillReminderById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id
    ) {
        User user = getAuthenticatedUser(userDetails);
        BillReminderResponse resp = billReminderService.getBillReminderById(id, user);
        return ResponseEntity.ok(ApiResponse.success("Bill reminder retrieved", resp));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BillReminderResponse>> createBillReminder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody BillReminderRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        BillReminderResponse resp = billReminderService.createBillReminder(request, user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Bill reminder created successfully", resp));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BillReminderResponse>> updateBillReminder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id,
            @Valid @RequestBody BillReminderRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        BillReminderResponse resp = billReminderService.updateBillReminder(id, request, user);
        return ResponseEntity.ok(ApiResponse.success("Bill reminder updated successfully", resp));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<ApiResponse<BillReminderResponse>> markAsPaid(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id,
            @RequestParam(required = false, defaultValue = "true") boolean recordTransaction
    ) {
        User user = getAuthenticatedUser(userDetails);
        BillReminderResponse resp = billReminderService.markAsPaid(id, recordTransaction, user);
        return ResponseEntity.ok(ApiResponse.success("Bill marked as paid", resp));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBillReminder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id
    ) {
        User user = getAuthenticatedUser(userDetails);
        billReminderService.deleteBillReminder(id, user);
        return ResponseEntity.ok(ApiResponse.success("Bill reminder deleted successfully", null));
    }
}
