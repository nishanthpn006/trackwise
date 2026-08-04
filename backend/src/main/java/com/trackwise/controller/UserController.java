package com.trackwise.controller;

import com.trackwise.dto.ApiResponse;
import com.trackwise.dto.DeleteAccountRequest;
import com.trackwise.dto.UpdateAvatarRequest;
import com.trackwise.dto.UpdateNotificationsRequest;
import com.trackwise.dto.UpdatePasswordRequest;
import com.trackwise.dto.UpdatePreferencesRequest;
import com.trackwise.dto.UpdateProfileRequest;
import com.trackwise.dto.UserProfileResponse;
import com.trackwise.dto.UserStatisticsResponse;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * UserController — REST endpoints for user profile, account settings, security, preferences, and account lifecycle.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getAuthenticatedUser(userDetails);
        UserProfileResponse profile = userService.getProfile(user);
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved successfully", profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        UserProfileResponse profile = userService.updateProfile(user, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> updatePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdatePasswordRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        userService.updatePassword(user, request);
        return ResponseEntity.ok(ApiResponse.success("Password updated successfully", null));
    }

    @PutMapping("/preferences")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updatePreferences(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdatePreferencesRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        UserProfileResponse profile = userService.updatePreferences(user, request);
        return ResponseEntity.ok(ApiResponse.success("Preferences updated successfully", profile));
    }

    @PutMapping("/notifications")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateNotifications(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateNotificationsRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        UserProfileResponse profile = userService.updateNotifications(user, request);
        return ResponseEntity.ok(ApiResponse.success("Notification settings updated successfully", profile));
    }

    @PostMapping("/avatar")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateAvatar(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateAvatarRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        UserProfileResponse profile = userService.updateAvatar(user, request);
        return ResponseEntity.ok(ApiResponse.success("Avatar updated successfully", profile));
    }

    @DeleteMapping("/avatar")
    public ResponseEntity<ApiResponse<UserProfileResponse>> deleteAvatar(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getAuthenticatedUser(userDetails);
        UserProfileResponse profile = userService.deleteAvatar(user);
        return ResponseEntity.ok(ApiResponse.success("Avatar removed successfully", profile));
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<UserStatisticsResponse>> getStatistics(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getAuthenticatedUser(userDetails);
        UserStatisticsResponse stats = userService.getStatistics(user);
        return ResponseEntity.ok(ApiResponse.success("User statistics retrieved successfully", stats));
    }

    @DeleteMapping("/account")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody DeleteAccountRequest request
    ) {
        User user = getAuthenticatedUser(userDetails);
        userService.deleteAccount(user, request);
        return ResponseEntity.ok(ApiResponse.success("Account deleted successfully", null));
    }
}
