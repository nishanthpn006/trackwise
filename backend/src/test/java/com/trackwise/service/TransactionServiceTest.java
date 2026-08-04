package com.trackwise.service;

import com.trackwise.dto.CategoryRequest;
import com.trackwise.dto.CategoryResponse;
import com.trackwise.dto.DashboardSummaryResponse;
import com.trackwise.dto.PagedResponse;
import com.trackwise.dto.TransactionRequest;
import com.trackwise.dto.TransactionResponse;
import com.trackwise.entity.Role;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import com.trackwise.exception.ResourceNotFoundException;
import com.trackwise.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class TransactionServiceTest {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserRepository userRepository;

    private User userA;
    private User userB;
    private CategoryResponse category;

    @BeforeEach
    void setUp() {
        userA = userRepository.save(new User("User A", "usera@example.com", "pass123", Role.ROLE_USER));
        userB = userRepository.save(new User("User B", "userb@example.com", "pass123", Role.ROLE_USER));

        CategoryRequest catReq = new CategoryRequest("Salary Test", TransactionType.INCOME, "wallet", "#00FF00");
        category = categoryService.createCategory(catReq, userA);
    }

    @Test
    void createTransaction_And_GetSummary() {
        TransactionRequest incReq = new TransactionRequest(
                "Monthly Salary",
                new BigDecimal("5000.00"),
                TransactionType.INCOME,
                category.getId(),
                LocalDate.now(),
                "Primary job paycheck"
        );
        TransactionResponse tx1 = transactionService.createTransaction(incReq, userA);
        assertNotNull(tx1.getId());

        TransactionRequest expReq = new TransactionRequest(
                "Grocery Shopping",
                new BigDecimal("200.00"),
                TransactionType.EXPENSE,
                null,
                LocalDate.now(),
                "Supermarket"
        );
        transactionService.createTransaction(expReq, userA);

        DashboardSummaryResponse summary = transactionService.getDashboardSummary(userA);
        assertEquals(0, new BigDecimal("5000.00").compareTo(summary.getTotalIncome()));
        assertEquals(0, new BigDecimal("200.00").compareTo(summary.getTotalExpense()));
        assertEquals(0, new BigDecimal("4800.00").compareTo(summary.getBalance()));
        assertEquals(0, new BigDecimal("4800.00").compareTo(summary.getTotalBalance()));
        assertEquals(0, new BigDecimal("4800.00").compareTo(summary.getSavings()));
        assertEquals(2, summary.getRecentTransactions().size());
    }

    @Test
    void userIsolation_UserBCannotAccessUserATransactions() {
        TransactionRequest req = new TransactionRequest(
                "Secret Transaction",
                new BigDecimal("100.00"),
                TransactionType.EXPENSE,
                null,
                LocalDate.now(),
                "Private"
        );
        TransactionResponse created = transactionService.createTransaction(req, userA);

        // User B attempting to access User A's transaction must throw ResourceNotFoundException
        assertThrows(ResourceNotFoundException.class, () -> transactionService.getTransactionById(created.getId(), userB));

        // User B's transaction list must be empty
        PagedResponse<TransactionResponse> userBList = transactionService.getTransactions(
                userB, null, null, null, null, null, PageRequest.of(0, 10)
        );
        assertTrue(userBList.getContent().isEmpty());
    }
}
