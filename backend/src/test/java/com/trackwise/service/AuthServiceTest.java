package com.trackwise.service;

import com.trackwise.dto.AuthResponse;
import com.trackwise.dto.LoginRequest;
import com.trackwise.dto.RegisterRequest;
import com.trackwise.exception.DuplicateEmailException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Test
    void register_Success() {
        RegisterRequest request = new RegisterRequest("Test User", "testuser@example.com", "password123");
        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals("Test User", response.getUser().getFullName());
        assertEquals("testuser@example.com", response.getUser().getEmail());
    }

    @Test
    void register_DuplicateEmail_ThrowsException() {
        RegisterRequest request = new RegisterRequest("Test User", "duplicate@example.com", "password123");
        authService.register(request);

        RegisterRequest duplicateRequest = new RegisterRequest("Another User", "duplicate@example.com", "password456");
        assertThrows(DuplicateEmailException.class, () -> authService.register(duplicateRequest));
    }

    @Test
    void login_Success() {
        RegisterRequest regRequest = new RegisterRequest("Login User", "login@example.com", "securepass");
        authService.register(regRequest);

        LoginRequest loginRequest = new LoginRequest("login@example.com", "securepass");
        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("login@example.com", response.getUser().getEmail());
    }

    @Test
    void login_WrongPassword_ThrowsException() {
        RegisterRequest regRequest = new RegisterRequest("Login User 2", "login2@example.com", "correctpass");
        authService.register(regRequest);

        LoginRequest loginRequest = new LoginRequest("login2@example.com", "wrongpass");
        assertThrows(BadCredentialsException.class, () -> authService.login(loginRequest));
    }
}
