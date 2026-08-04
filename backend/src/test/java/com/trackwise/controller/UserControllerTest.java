package com.trackwise.controller;

import com.trackwise.dto.*;
import com.trackwise.entity.Role;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SuppressWarnings("null")
class UserControllerTest {

    private UserService userService;
    private UserRepository userRepository;
    private UserController userController;
    private User testUser;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        userService = Mockito.mock(UserService.class);
        userRepository = Mockito.mock(UserRepository.class);
        userController = new UserController(userService, userRepository);

        testUser = new User("Test User", "test@example.com", "pass", Role.ROLE_USER);
        testUser.setId(UUID.randomUUID());
        userDetails = Mockito.mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
    }

    @Test
    @DisplayName("Should fetch user profile successfully")
    void testGetProfile() {
        UserProfileResponse mockProfile = new UserProfileResponse();
        mockProfile.setEmail("test@example.com");
        when(userService.getProfile(testUser)).thenReturn(mockProfile);

        ResponseEntity<ApiResponse<UserProfileResponse>> response = userController.getProfile(userDetails);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("test@example.com", response.getBody().getData().getEmail());
    }

    @Test
    @DisplayName("Should update user profile")
    void testUpdateProfile() {
        UpdateProfileRequest req = new UpdateProfileRequest();
        req.setFullName("Updated Name");

        UserProfileResponse mockProfile = new UserProfileResponse();
        mockProfile.setFullName("Updated Name");

        when(userService.updateProfile(eq(testUser), eq(req))).thenReturn(mockProfile);

        ResponseEntity<ApiResponse<UserProfileResponse>> response = userController.updateProfile(userDetails, req);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("Updated Name", response.getBody().getData().getFullName());
    }

    @Test
    @DisplayName("Should update password")
    void testUpdatePassword() {
        UpdatePasswordRequest req = new UpdatePasswordRequest("oldpass", "newpass");

        ResponseEntity<ApiResponse<Void>> response = userController.updatePassword(userDetails, req);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        verify(userService).updatePassword(eq(testUser), eq(req));
    }

    @Test
    @DisplayName("Should fetch user statistics")
    void testGetUserStatistics() {
        UserStatisticsResponse stats = new UserStatisticsResponse(10, 5, 2, 3, 1, LocalDateTime.now());
        when(userService.getStatistics(testUser)).thenReturn(stats);

        ResponseEntity<ApiResponse<UserStatisticsResponse>> response = userController.getStatistics(userDetails);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(10, response.getBody().getData().getTransactionsCount());
    }

    @Test
    @DisplayName("Should delete account")
    void testDeleteAccount() {
        DeleteAccountRequest req = new DeleteAccountRequest();
        req.setPassword("pass");

        ResponseEntity<ApiResponse<Void>> response = userController.deleteAccount(userDetails, req);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        verify(userService).deleteAccount(eq(testUser), eq(req));
    }
}
