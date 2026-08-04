package com.trackwise.controller;

import com.trackwise.dto.*;
import com.trackwise.entity.Role;
import com.trackwise.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@SuppressWarnings("null")
class AuthControllerTest {

    private AuthService authService;
    private AuthController authController;

    @BeforeEach
    void setUp() {
        authService = Mockito.mock(AuthService.class);
        authController = new AuthController(authService);
    }

    @Test
    @DisplayName("Should register user successfully")
    void testRegister() {
        RegisterRequest req = new RegisterRequest("Test User", "test@example.com", "password123");
        UserSummaryDto userSummary = new UserSummaryDto(UUID.randomUUID(), "Test User", "test@example.com", Role.ROLE_USER);
        AuthResponse mockAuth = new AuthResponse("mock-jwt-token", userSummary);

        when(authService.register(eq(req))).thenReturn(mockAuth);

        ResponseEntity<ApiResponse<AuthResponse>> response = authController.register(req);

        assertNotNull(response);
        assertEquals(201, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        assertEquals("mock-jwt-token", response.getBody().getData().getToken());
    }

    @Test
    @DisplayName("Should login user successfully")
    void testLogin() {
        LoginRequest req = new LoginRequest("test@example.com", "password123");
        UserSummaryDto userSummary = new UserSummaryDto(UUID.randomUUID(), "Test User", "test@example.com", Role.ROLE_USER);
        AuthResponse mockAuth = new AuthResponse("mock-jwt-token", userSummary);

        when(authService.login(eq(req))).thenReturn(mockAuth);

        ResponseEntity<ApiResponse<AuthResponse>> response = authController.login(req);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("mock-jwt-token", response.getBody().getData().getToken());
    }

    @Test
    @DisplayName("Should fetch current user profile successfully")
    void testGetCurrentUser() {
        UserDetails userDetails = Mockito.mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@example.com");

        UserSummaryDto mockUser = new UserSummaryDto(UUID.randomUUID(), "Test User", "test@example.com", Role.ROLE_USER);
        when(authService.getCurrentUser("test@example.com")).thenReturn(mockUser);

        ResponseEntity<ApiResponse<UserSummaryDto>> response = authController.getCurrentUser(userDetails);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("Test User", response.getBody().getData().getFullName());
    }

    @Test
    @DisplayName("Should return 401 Unauthorized for null UserDetails in me endpoint")
    void testGetCurrentUser_Unauthenticated() {
        ResponseEntity<ApiResponse<UserSummaryDto>> response = authController.getCurrentUser(null);

        assertNotNull(response);
        assertEquals(401, response.getStatusCode().value());
        assertFalse(response.getBody().isSuccess());
    }
}
