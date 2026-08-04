package com.trackwise.service;

import com.trackwise.dto.DashboardAnalyticsResponse;
import com.trackwise.entity.Role;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import com.trackwise.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

/**
 * AnalyticsServiceTest — Unit tests for AnalyticsService using Mockito.
 */
class AnalyticsServiceTest {

    private TransactionRepository transactionRepository;
    private AnalyticsService analyticsService;
    private User user;

    @BeforeEach
    void setUp() {
        transactionRepository = Mockito.mock(TransactionRepository.class);
        analyticsService = new AnalyticsService(transactionRepository);
        user = new User("Test User", "test@example.com", "pass", Role.ROLE_USER);
    }

    @Test
    void getDashboardAnalytics_WithNoData_ReturnsEmptyCollections() {
        // Repository returns zeros and empty lists for all queries
        when(transactionRepository.sumAmountByUserAndTypeAndDateBetween(
                eq(user), any(TransactionType.class), any(LocalDate.class), any(LocalDate.class)
        )).thenReturn(BigDecimal.ZERO);

        when(transactionRepository.findByUserAndTypeAndDateBetween(
                eq(user), any(TransactionType.class), any(LocalDate.class), any(LocalDate.class)
        )).thenReturn(Collections.emptyList());

        when(transactionRepository.countByUser(user)).thenReturn(0L);

        DashboardAnalyticsResponse response = analyticsService.getDashboardAnalytics(user);

        assertNotNull(response);

        // Monthly data should have 6 entries (one per month)
        assertNotNull(response.getMonthlyData());
        assertEquals(6, response.getMonthlyData().size());
        response.getMonthlyData().forEach(point -> {
            assertNotNull(point.getMonth());
            assertEquals(BigDecimal.ZERO, point.getIncome());
            assertEquals(BigDecimal.ZERO, point.getExpense());
        });

        // Category breakdown should be empty with no expenses
        assertNotNull(response.getCategoryBreakdown());
        assertTrue(response.getCategoryBreakdown().isEmpty());

        // Spending trend should have 30 entries
        assertNotNull(response.getSpendingTrend());
        assertEquals(30, response.getSpendingTrend().size());

        // Financial insights with no data
        assertNotNull(response.getFinancialInsights());
        assertNull(response.getFinancialInsights().getHighestSpendingCategory());
        assertEquals(0, response.getFinancialInsights().getTransactionCount());
        assertEquals(BigDecimal.ZERO, response.getFinancialInsights().getMonthlySavingsPercentage());
    }

    @Test
    void getDashboardAnalytics_WithData_PopulatesAllSections() {
        // Monthly income/expense data
        when(transactionRepository.sumAmountByUserAndTypeAndDateBetween(
                eq(user), eq(TransactionType.INCOME), any(LocalDate.class), any(LocalDate.class)
        )).thenReturn(new BigDecimal("3000.00"));

        when(transactionRepository.sumAmountByUserAndTypeAndDateBetween(
                eq(user), eq(TransactionType.EXPENSE), any(LocalDate.class), any(LocalDate.class)
        )).thenReturn(new BigDecimal("1200.00"));

        when(transactionRepository.findByUserAndTypeAndDateBetween(
                eq(user), eq(TransactionType.EXPENSE), any(LocalDate.class), any(LocalDate.class)
        )).thenReturn(Collections.emptyList());

        when(transactionRepository.countByUser(user)).thenReturn(42L);

        DashboardAnalyticsResponse response = analyticsService.getDashboardAnalytics(user);

        assertNotNull(response);
        assertEquals(6, response.getMonthlyData().size());

        // Verify income > 0 is reflected
        response.getMonthlyData().forEach(p -> {
            assertEquals(new BigDecimal("3000.00"), p.getIncome());
            assertEquals(new BigDecimal("1200.00"), p.getExpense());
        });

        // Financial insights
        assertNotNull(response.getFinancialInsights());
        assertEquals(42L, response.getFinancialInsights().getTransactionCount());
        assertEquals(0, response.getFinancialInsights().getCurrentMonthBalance()
                .compareTo(new BigDecimal("1800.00")));

        // Savings percentage: (3000 - 1200) / 3000 * 100 = 60%
        assertEquals(0, response.getFinancialInsights().getMonthlySavingsPercentage()
                .compareTo(new BigDecimal("60.0")));
    }
}
