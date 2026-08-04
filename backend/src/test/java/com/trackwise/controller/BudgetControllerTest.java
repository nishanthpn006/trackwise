package com.trackwise.controller;

import com.trackwise.dto.ApiResponse;
import com.trackwise.dto.BudgetRequest;
import com.trackwise.dto.BudgetResponse;
import com.trackwise.entity.BudgetPeriod;
import com.trackwise.entity.Role;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.BudgetService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SuppressWarnings("null")
class BudgetControllerTest {

    private BudgetService budgetService;
    private UserRepository userRepository;
    private BudgetController budgetController;
    private User testUser;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        budgetService = Mockito.mock(BudgetService.class);
        userRepository = Mockito.mock(UserRepository.class);
        budgetController = new BudgetController(budgetService, userRepository);

        testUser = new User("Test User", "test@example.com", "pass", Role.ROLE_USER);
        userDetails = Mockito.mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
    }

    @Test
    @DisplayName("Should fetch all budgets")
    void testGetBudgets() {
        when(budgetService.getBudgets(testUser)).thenReturn(Collections.emptyList());

        ResponseEntity<ApiResponse<java.util.List<BudgetResponse>>> response = budgetController.getBudgets(userDetails);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
    }

    @Test
    @DisplayName("Should create budget successfully")
    void testCreateBudget() {
        BudgetRequest req = new BudgetRequest();
        req.setName("Monthly Dining");
        req.setAmount(new BigDecimal("500.00"));
        req.setPeriod(BudgetPeriod.MONTHLY);
        req.setStartDate(LocalDate.now().withDayOfMonth(1));
        req.setEndDate(LocalDate.now().withDayOfMonth(28));

        BudgetResponse mockRes = new BudgetResponse();
        mockRes.setId(UUID.randomUUID());
        mockRes.setName("Monthly Dining");
        mockRes.setAmount(new BigDecimal("500.00"));

        when(budgetService.createBudget(eq(req), eq(testUser))).thenReturn(mockRes);

        ResponseEntity<ApiResponse<BudgetResponse>> response = budgetController.createBudget(userDetails, req);

        assertNotNull(response);
        assertEquals(201, response.getStatusCode().value());
        assertEquals(new BigDecimal("500.00"), response.getBody().getData().getAmount());
    }

    @Test
    @DisplayName("Should delete budget")
    void testDeleteBudget() {
        UUID budgetId = UUID.randomUUID();

        ResponseEntity<ApiResponse<Void>> response = budgetController.deleteBudget(userDetails, budgetId);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        verify(budgetService).deleteBudget(budgetId, testUser);
    }
}
