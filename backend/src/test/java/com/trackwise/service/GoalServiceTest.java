package com.trackwise.service;

import com.trackwise.dto.GoalContributionRequest;
import com.trackwise.dto.GoalRequest;
import com.trackwise.dto.GoalResponse;
import com.trackwise.dto.GoalSummaryResponse;
import com.trackwise.entity.GoalStatus;
import com.trackwise.entity.Role;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class GoalServiceTest {

    @Autowired
    private GoalService goalService;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = userRepository.save(new User("Goal Test User", "goaltest@example.com", "pass123", Role.ROLE_USER));
    }

    @Test
    void createGoal_Success() {
        GoalRequest request = new GoalRequest(
                "Emergency Fund",
                new BigDecimal("5000.00"),
                new BigDecimal("1000.00"),
                LocalDate.now().plusMonths(6),
                "Savings",
                "Shield",
                "#3B82F6",
                "Build 3-month expense cushion"
        );

        GoalResponse response = goalService.createGoal(request, testUser);

        assertNotNull(response);
        assertNotNull(response.getId());
        assertEquals("Emergency Fund", response.getName());
        assertEquals(new BigDecimal("5000.00"), response.getTargetAmount());
        assertEquals(new BigDecimal("1000.00"), response.getCurrentAmount());
        assertEquals(new BigDecimal("4000.00"), response.getRemainingAmount());
        assertEquals(GoalStatus.IN_PROGRESS, response.getStatus());
    }

    @Test
    void createGoal_SavedExceedsTarget_ThrowsException() {
        GoalRequest request = new GoalRequest(
                "Overfunded Goal",
                new BigDecimal("1000.00"),
                new BigDecimal("1500.00"),
                LocalDate.now().plusMonths(1),
                "Savings",
                "Target",
                "#10B981",
                "Invalid target"
        );

        assertThrows(IllegalArgumentException.class, () -> goalService.createGoal(request, testUser));
    }

    @Test
    void addContribution_Success() {
        GoalRequest createReq = new GoalRequest(
                "Vacation Fund",
                new BigDecimal("2000.00"),
                new BigDecimal("500.00"),
                LocalDate.now().plusMonths(3),
                "Travel",
                "Plane",
                "#F59E0B",
                "Trip to Tokyo"
        );
        GoalResponse created = goalService.createGoal(createReq, testUser);

        GoalContributionRequest contribReq = new GoalContributionRequest(
                new BigDecimal("1500.00"),
                LocalDate.now(),
                "Bonus deposit"
        );

        GoalResponse updated = goalService.addContribution(created.getId(), contribReq, testUser);

        assertEquals(new BigDecimal("2000.00"), updated.getCurrentAmount());
        assertEquals(new BigDecimal("0.00"), updated.getRemainingAmount());
        assertEquals(GoalStatus.COMPLETED, updated.getStatus());
    }

    @Test
    void getGoalSummary_ComputesKPIsCorrectly() {
        GoalRequest g1 = new GoalRequest("Goal 1", new BigDecimal("1000.00"), new BigDecimal("200.00"), LocalDate.now().plusDays(10), "General", "Target", "#3B82F6", "");
        GoalRequest g2 = new GoalRequest("Goal 2", new BigDecimal("2000.00"), new BigDecimal("2000.00"), LocalDate.now().plusDays(20), "General", "Check", "#10B981", "");
        goalService.createGoal(g1, testUser);
        goalService.createGoal(g2, testUser);

        GoalSummaryResponse summary = goalService.getGoalSummary(testUser);

        assertEquals(2, summary.getTotalGoals());
        assertEquals(1, summary.getActiveGoals());
        assertEquals(1, summary.getCompletedGoals());
        assertEquals(new BigDecimal("3000.00"), summary.getTotalTargetAmount());
        assertEquals(new BigDecimal("2200.00"), summary.getTotalSaved());
        assertEquals(new BigDecimal("800.00"), summary.getRemainingSavings());
    }
}
