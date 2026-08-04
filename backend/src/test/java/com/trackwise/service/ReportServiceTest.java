package com.trackwise.service;

import com.trackwise.dto.ReportSummaryResponse;
import com.trackwise.entity.Role;
import com.trackwise.entity.Transaction;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import com.trackwise.repository.TransactionRepository;
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
class ReportServiceTest {

    @Autowired
    private ReportService reportService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = userRepository.save(new User("Report Test User", "reporttest@example.com", "pass123", Role.ROLE_USER));
    }

    @Test
    void getReportSummary_ComputesKPIsCorrectly() {
        Transaction inc = new Transaction("Salary", new BigDecimal("5000.00"), TransactionType.INCOME, "Monthly pay", LocalDate.now(), null, testUser);
        Transaction exp1 = new Transaction("Rent", new BigDecimal("1500.00"), TransactionType.EXPENSE, "Apartment rent", LocalDate.now(), null, testUser);
        Transaction exp2 = new Transaction("Groceries", new BigDecimal("500.00"), TransactionType.EXPENSE, "Food supplies", LocalDate.now(), null, testUser);

        transactionRepository.save(inc);
        transactionRepository.save(exp1);
        transactionRepository.save(exp2);

        ReportSummaryResponse summary = reportService.getReportSummary(
                testUser,
                LocalDate.now().minusDays(30),
                LocalDate.now(),
                null,
                null
        );

        assertNotNull(summary);
        assertEquals(new BigDecimal("5000.00"), summary.getTotalIncome());
        assertEquals(new BigDecimal("2000.00"), summary.getTotalExpenses());
        assertEquals(new BigDecimal("3000.00"), summary.getNetSavings());
        assertEquals(3, summary.getTransactionsCount());
        assertEquals(new BigDecimal("1500.00"), summary.getLargestExpense());
        assertEquals(new BigDecimal("5000.00"), summary.getLargestIncome());
    }
}
