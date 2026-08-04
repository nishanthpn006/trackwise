package com.trackwise.controller;

import com.trackwise.dto.ApiResponse;
import com.trackwise.dto.NotificationResponse;
import com.trackwise.dto.NotificationSummaryResponse;
import com.trackwise.entity.NotificationPriority;
import com.trackwise.entity.NotificationType;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * NotificationController — REST endpoints for notifications, alerts, summaries, and unread counts.
 */
@RestController
@RequestMapping("/api/notifications")
@SuppressWarnings("null")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(NotificationService notificationService, UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Boolean unreadOnly,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search
    ) {
        User user = getAuthenticatedUser(userDetails);
        notificationService.generateSystemNotificationsForUser(user);
        List<NotificationResponse> list = notificationService.getUserNotifications(user, unreadOnly, type, search);
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved successfully", list));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getAuthenticatedUser(userDetails);
        long count = notificationService.getUnreadCount(user);
        return ResponseEntity.ok(ApiResponse.success("Unread count retrieved successfully", count));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<NotificationSummaryResponse>> getSummary(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getAuthenticatedUser(userDetails);
        notificationService.generateSystemNotificationsForUser(user);
        NotificationSummaryResponse summary = notificationService.getSummary(user);
        return ResponseEntity.ok(ApiResponse.success("Notification summary retrieved successfully", summary));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id
    ) {
        User user = getAuthenticatedUser(userDetails);
        NotificationResponse updated = notificationService.markAsRead(user, id);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", updated));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getAuthenticatedUser(userDetails);
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id
    ) {
        User user = getAuthenticatedUser(userDetails);
        notificationService.deleteNotification(user, id);
        return ResponseEntity.ok(ApiResponse.success("Notification deleted", null));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearAllNotifications(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getAuthenticatedUser(userDetails);
        notificationService.clearAllNotifications(user);
        return ResponseEntity.ok(ApiResponse.success("All notifications cleared", null));
    }

    @PostMapping("/generate-summaries")
    public ResponseEntity<ApiResponse<Void>> generateSummaries(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getAuthenticatedUser(userDetails);
        notificationService.createNotification(
                user,
                "Monthly Financial Summary Ready",
                "Your monthly financial digest for the active period is ready to review under Reports.",
                NotificationType.MONTHLY_SUMMARY,
                NotificationPriority.MEDIUM,
                "/reports"
        );
        return ResponseEntity.ok(ApiResponse.success("Monthly summary notification generated", null));
    }
}
