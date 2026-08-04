package com.trackwise.controller;

import com.trackwise.dto.ApiResponse;
import com.trackwise.dto.GoalContributionRequest;
import com.trackwise.dto.GoalRequest;
import com.trackwise.dto.GoalResponse;
import com.trackwise.entity.Goal;
import com.trackwise.entity.Role;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.GoalService;
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
class GoalControllerTest {

    private GoalService goalService;
    private UserRepository userRepository;
    private GoalController goalController;
    private User testUser;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        goalService = Mockito.mock(GoalService.class);
        userRepository = Mockito.mock(UserRepository.class);
        goalController = new GoalController(goalService, userRepository);

        testUser = new User("Test User", "test@example.com", "pass", Role.ROLE_USER);
        userDetails = Mockito.mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
    }

    @Test
    @DisplayName("Should fetch all goals")
    void testGetGoals() {
        when(goalService.getGoals(testUser)).thenReturn(Collections.emptyList());

        ResponseEntity<ApiResponse<java.util.List<GoalResponse>>> response = goalController.getGoals(userDetails);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
    }

    @Test
    @DisplayName("Should create goal successfully")
    void testCreateGoal() {
        GoalRequest req = new GoalRequest();
        req.setName("New Car");
        req.setTargetAmount(new BigDecimal("10000.00"));
        req.setCurrentAmount(new BigDecimal("1000.00"));
        req.setTargetDate(LocalDate.now().plusYears(1));

        Goal g = new Goal();
        g.setId(UUID.randomUUID());
        g.setName("New Car");
        g.setTargetAmount(new BigDecimal("10000.00"));
        g.setCurrentAmount(new BigDecimal("1000.00"));
        g.setTargetDate(LocalDate.now().plusYears(1));
        GoalResponse mockRes = new GoalResponse(g);

        when(goalService.createGoal(eq(req), eq(testUser))).thenReturn(mockRes);

        ResponseEntity<ApiResponse<GoalResponse>> response = goalController.createGoal(userDetails, req);

        assertNotNull(response);
        assertEquals(201, response.getStatusCode().value());
        assertEquals("New Car", response.getBody().getData().getName());
    }

    @Test
    @DisplayName("Should log goal contribution")
    void testAddContribution() {
        UUID goalId = UUID.randomUUID();
        GoalContributionRequest req = new GoalContributionRequest(new BigDecimal("500.00"), LocalDate.now(), "Monthly savings deposit");

        Goal g = new Goal();
        g.setId(goalId);
        g.setName("New Car");
        g.setTargetAmount(new BigDecimal("10000.00"));
        g.setCurrentAmount(new BigDecimal("1500.00"));
        g.setTargetDate(LocalDate.now().plusYears(1));
        GoalResponse mockRes = new GoalResponse(g);

        when(goalService.addContribution(eq(goalId), eq(req), eq(testUser))).thenReturn(mockRes);

        ResponseEntity<ApiResponse<GoalResponse>> response = goalController.addContribution(userDetails, goalId, req);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(new BigDecimal("1500.00"), response.getBody().getData().getCurrentAmount());
    }

    @Test
    @DisplayName("Should delete goal")
    void testDeleteGoal() {
        UUID goalId = UUID.randomUUID();

        ResponseEntity<ApiResponse<Void>> response = goalController.deleteGoal(userDetails, goalId);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        verify(goalService).deleteGoal(goalId, testUser);
    }
}
