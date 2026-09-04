package com.trackwise.service;

import com.trackwise.dto.AccountRequest;
import com.trackwise.dto.CategoryRequest;
import com.trackwise.dto.CategoryResponse;
import com.trackwise.dto.DashboardSummaryResponse;
import com.trackwise.dto.TransactionRequest;
import com.trackwise.entity.AccountType;
import com.trackwise.entity.Role;
import com.trackwise.entity.TransactionType;
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

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class DashboardServiceTest {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserRepository userRepository;

    private User userA;
    private User userB;

    @BeforeEach
    void setUp() {
        userA = userRepository.save(new User("Alice", "alice_dash@example.com", "password123", Role.ROLE_USER));
        userB = userRepository.save(new User("Bob", "bob_dash@example.com", "password123", Role.ROLE_USER));
    }

    @Test
    void getDashboardSummary_ThisMonth_CalculatesMetricsCorrectly() {
        // 1. Create 2 accounts for User A
        accountService.createAccount(new AccountRequest(
                "Checking", AccountType.BANK, new BigDecimal("20000.00"), "INR", null, null, null
        ), userA);
        accountService.createAccount(new AccountRequest(
                "Cash", AccountType.CASH, new BigDecimal("5000.00"), "INR", null, null, null
        ), userA);

        // 2. Create Category
        CategoryResponse foodCat = categoryService.createCategory(
                new CategoryRequest("Groceries", TransactionType.EXPENSE, "shopping-bag", "#EF4444"), userA
        );

        // 3. Transactions this month
        LocalDate today = LocalDate.now();
        transactionService.createTransaction(new TransactionRequest(
                "Salary", new BigDecimal("50000.00"), TransactionType.INCOME, null, today, "Job"
        ), userA);

        transactionService.createTransaction(new TransactionRequest(
                "Supermarket", new BigDecimal("8000.00"), TransactionType.EXPENSE, foodCat.getId(), today, "Food"
        ), userA);

        // 4. Transaction in LAST month (should NOT count towards this month's income/expense)
        LocalDate lastMonthDate = today.minusMonths(1).withDayOfMonth(15);
        transactionService.createTransaction(new TransactionRequest(
                "Old Gig", new BigDecimal("10000.00"), TransactionType.INCOME, null, lastMonthDate, "Past"
        ), userA);

        // Query THIS_MONTH
        DashboardSummaryResponse summary = dashboardService.getDashboardSummary(userA, "THIS_MONTH", null, null);

        assertNotNull(summary);
        assertEquals(0, new BigDecimal("25000.00").compareTo(summary.getTotalBalance()));
        assertEquals(0, new BigDecimal("50000.00").compareTo(summary.getTotalIncome()));
        assertEquals(0, new BigDecimal("8000.00").compareTo(summary.getTotalExpense()));
        assertEquals(0, new BigDecimal("42000.00").compareTo(summary.getNetCashFlow()));
        assertEquals(2, summary.getTransactionCount());
        assertEquals("Groceries", summary.getTopCategory());
        assertFalse(summary.getCategoryBreakdown().isEmpty());
        assertEquals("Groceries", summary.getCategoryBreakdown().get(0).getCategoryName());
        assertEquals(0, new BigDecimal("8000.00").compareTo(summary.getCategoryBreakdown().get(0).getAmount()));
        assertEquals(0, new BigDecimal("100.0").compareTo(summary.getCategoryBreakdown().get(0).getPercentage()));
    }

    @Test
    void getDashboardSummary_LastMonth_IsolatesLastMonthData() {
        LocalDate today = LocalDate.now();
        LocalDate lastMonthDate = today.minusMonths(1).withDayOfMonth(10);

        transactionService.createTransaction(new TransactionRequest(
                "Last Month Freelance", new BigDecimal("15000.00"), TransactionType.INCOME, null, lastMonthDate, "Past job"
        ), userA);

        transactionService.createTransaction(new TransactionRequest(
                "Last Month Utility", new BigDecimal("2500.00"), TransactionType.EXPENSE, null, lastMonthDate, "Power"
        ), userA);

        // Transaction today (this month)
        transactionService.createTransaction(new TransactionRequest(
                "Today Lunch", new BigDecimal("300.00"), TransactionType.EXPENSE, null, today, "Snack"
        ), userA);

        DashboardSummaryResponse lastMonthSummary = dashboardService.getDashboardSummary(userA, "LAST_MONTH", null, null);

        assertEquals(0, new BigDecimal("15000.00").compareTo(lastMonthSummary.getTotalIncome()));
        assertEquals(0, new BigDecimal("2500.00").compareTo(lastMonthSummary.getTotalExpense()));
        assertEquals(0, new BigDecimal("12500.00").compareTo(lastMonthSummary.getNetCashFlow()));
        assertEquals(2, lastMonthSummary.getTransactionCount());
    }

    @Test
    void getDashboardSummary_AllTime_AggregatesAllTransactions() {
        LocalDate today = LocalDate.now();
        LocalDate pastDate = today.minusMonths(2).withDayOfMonth(1);

        transactionService.createTransaction(new TransactionRequest(
                "Past Income", new BigDecimal("20000.00"), TransactionType.INCOME, null, pastDate, "Old"
        ), userA);
        transactionService.createTransaction(new TransactionRequest(
                "Current Income", new BigDecimal("30000.00"), TransactionType.INCOME, null, today, "New"
        ), userA);

        DashboardSummaryResponse summary = dashboardService.getDashboardSummary(userA, "ALL_TIME", null, null);
        assertEquals(0, new BigDecimal("50000.00").compareTo(summary.getTotalIncome()));
        assertEquals(2, summary.getTransactionCount());
    }

    @Test
    void userIsolation_UserBCannotSeeUserAData() {
        accountService.createAccount(new AccountRequest(
                "Alice Secret Account", AccountType.SAVINGS, new BigDecimal("100000.00"), "INR", null, null, null
        ), userA);

        transactionService.createTransaction(new TransactionRequest(
                "Alice Big Bonus", new BigDecimal("75000.00"), TransactionType.INCOME, null, LocalDate.now(), "Confidential"
        ), userA);

        // Bob's dashboard summary must be completely empty / zero
        DashboardSummaryResponse bobSummary = dashboardService.getDashboardSummary(userB, "THIS_MONTH", null, null);

        assertEquals(0, BigDecimal.ZERO.compareTo(bobSummary.getTotalBalance()));
        assertEquals(0, BigDecimal.ZERO.compareTo(bobSummary.getTotalIncome()));
        assertEquals(0, BigDecimal.ZERO.compareTo(bobSummary.getTotalExpense()));
        assertEquals(0, BigDecimal.ZERO.compareTo(bobSummary.getNetCashFlow()));
        assertEquals(0, bobSummary.getTransactionCount());
        assertTrue(bobSummary.getRecentTransactions().isEmpty());
        assertTrue(bobSummary.getCategoryBreakdown().isEmpty());
    }
}
