package com.trackwise.controller;

import com.trackwise.dto.ApiResponse;
import com.trackwise.dto.DashboardSummaryResponse;
import com.trackwise.entity.Role;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class DashboardControllerTest {

    private TransactionService transactionService;
    private UserRepository userRepository;
    private DashboardController dashboardController;

    @BeforeEach
    void setUp() {
        transactionService = Mockito.mock(TransactionService.class);
        userRepository = Mockito.mock(UserRepository.class);
        dashboardController = new DashboardController(transactionService, userRepository);
    }

    @Test
    void getDashboardSummary_Success() {
        User user = new User("Test User", "test@example.com", "pass", Role.ROLE_USER);
        UserDetails userDetails = Mockito.mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        DashboardSummaryResponse mockResponse = new DashboardSummaryResponse(
                new BigDecimal("1000.00"),
                new BigDecimal("2000.00"),
                new BigDecimal("1000.00"),
                new BigDecimal("1000.00"),
                Collections.emptyList()
        );
        when(transactionService.getDashboardSummary(user)).thenReturn(mockResponse);

        ResponseEntity<ApiResponse<DashboardSummaryResponse>> response = dashboardController.getDashboardSummary(userDetails);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        ApiResponse<DashboardSummaryResponse> body = response.getBody();
        assertNotNull(body);
        assertTrue(body.isSuccess());
        assertNotNull(body.getData());
        assertEquals(new BigDecimal("1000.00"), body.getData().getTotalBalance());
        assertEquals(new BigDecimal("1000.00"), body.getData().getSavings());
    }
}
