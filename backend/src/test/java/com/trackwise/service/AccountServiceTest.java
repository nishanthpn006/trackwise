package com.trackwise.service;

import com.trackwise.dto.AccountRequest;
import com.trackwise.dto.AccountResponse;
import com.trackwise.dto.TransactionRequest;
import com.trackwise.dto.TransactionResponse;
import com.trackwise.entity.AccountType;
import com.trackwise.entity.Role;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import com.trackwise.exception.ResourceNotFoundException;
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
class AccountServiceTest {

    @Autowired
    private AccountService accountService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserRepository userRepository;

    private User userA;
    private User userB;

    @BeforeEach
    void setUp() {
        userA = userRepository.save(new User("Alice", "alice@example.com", "password123", Role.ROLE_USER));
        userB = userRepository.save(new User("Bob", "bob@example.com", "password123", Role.ROLE_USER));
    }

    @Test
    void seedDefaultAccounts_CreatesStarterAccounts() {
        List<AccountResponse> accounts = accountService.getAccounts(userA, false);
        assertEquals(2, accounts.size());
        assertTrue(accounts.stream().anyMatch(a -> a.getName().equalsIgnoreCase("Cash")));
        assertTrue(accounts.stream().anyMatch(a -> a.getName().equalsIgnoreCase("Main Bank Account")));
    }

    @Test
    void createAccount_Success() {
        AccountRequest request = new AccountRequest(
                "Savings Vault",
                AccountType.SAVINGS,
                new BigDecimal("10000.00"),
                "INR",
                "#10B981",
                "piggy-bank",
                "Emergency savings fund"
        );

        AccountResponse created = accountService.createAccount(request, userA);
        assertNotNull(created.getId());
        assertEquals("Savings Vault", created.getName());
        assertEquals(AccountType.SAVINGS, created.getType());
        assertEquals(0, new BigDecimal("10000.00").compareTo(created.getCurrentBalance()));
        assertEquals(0, created.getTransactionCount());
    }

    @Test
    void duplicateAccountName_ThrowsException() {
        AccountRequest request1 = new AccountRequest(
                "HDFC Checking",
                AccountType.BANK,
                new BigDecimal("5000.00"),
                "INR",
                null, null, null
        );
        accountService.createAccount(request1, userA);

        AccountRequest duplicate = new AccountRequest(
                "hdfc checking",
                AccountType.BANK,
                BigDecimal.ZERO,
                "INR",
                null, null, null
        );

        assertThrows(IllegalArgumentException.class, () -> accountService.createAccount(duplicate, userA));
    }

    @Test
    void differentUser_CanUseSameAccountName() {
        AccountRequest requestA = new AccountRequest(
                "My Wallet",
                AccountType.WALLET,
                new BigDecimal("500.00"),
                "INR",
                null, null, null
        );
        AccountResponse respA = accountService.createAccount(requestA, userA);

        AccountRequest requestB = new AccountRequest(
                "My Wallet",
                AccountType.WALLET,
                new BigDecimal("1200.00"),
                "INR",
                null, null, null
        );
        AccountResponse respB = accountService.createAccount(requestB, userB);

        assertNotNull(respA.getId());
        assertNotNull(respB.getId());
        assertNotEquals(respA.getId(), respB.getId());
    }

    @Test
    void updateAccount_Success() {
        AccountRequest createReq = new AccountRequest(
                "Old Name",
                AccountType.CASH,
                new BigDecimal("1000.00"),
                "INR",
                null, null, null
        );
        AccountResponse created = accountService.createAccount(createReq, userA);

        AccountRequest updateReq = new AccountRequest(
                "Updated Name",
                AccountType.CASH,
                new BigDecimal("2500.00"),
                "INR",
                "#000000",
                "banknote",
                "Updated notes"
        );
        AccountResponse updated = accountService.updateAccount(created.getId(), updateReq, userA);

        assertEquals("Updated Name", updated.getName());
        assertEquals(0, new BigDecimal("2500.00").compareTo(updated.getCurrentBalance()));
    }

    @Test
    void deleteAccount_NoTransactions_Success() {
        AccountRequest request = new AccountRequest(
                "Temp Account",
                AccountType.SAVINGS,
                BigDecimal.ZERO,
                "INR",
                null, null, null
        );
        AccountResponse created = accountService.createAccount(request, userA);

        accountService.deleteAccount(created.getId(), userA);
        assertThrows(ResourceNotFoundException.class, () -> accountService.getAccountById(created.getId(), userA));
    }

    @Test
    void deleteAccount_WithTransactions_ThrowsException() {
        AccountRequest request = new AccountRequest(
                "Active Bank",
                AccountType.BANK,
                new BigDecimal("5000.00"),
                "INR",
                null, null, null
        );
        AccountResponse account = accountService.createAccount(request, userA);

        TransactionRequest txReq = new TransactionRequest(
                "Test Expense",
                new BigDecimal("500.00"),
                TransactionType.EXPENSE,
                null,
                account.getId(),
                LocalDate.now(),
                "Office supply"
        );
        transactionService.createTransaction(txReq, userA);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> accountService.deleteAccount(account.getId(), userA));
        assertTrue(ex.getMessage().contains("Cannot delete account associated with 1 transactions"));
    }

    @Test
    void transactions_UpdateAccountBalances_Accurately() {
        // 1. Create Account with opening balance 10,000
        AccountRequest request = new AccountRequest(
                "Primary Checking",
                AccountType.BANK,
                new BigDecimal("10000.00"),
                "INR",
                null, null, null
        );
        AccountResponse account = accountService.createAccount(request, userA);

        // 2. Create Income: +5,000 -> balance should be 15,000
        TransactionRequest incomeReq = new TransactionRequest(
                "Freelance Payment",
                new BigDecimal("5000.00"),
                TransactionType.INCOME,
                null,
                account.getId(),
                LocalDate.now(),
                "Client payment"
        );
        transactionService.createTransaction(incomeReq, userA);

        AccountResponse accAfterInc = accountService.getAccountById(account.getId(), userA);
        assertEquals(0, new BigDecimal("15000.00").compareTo(accAfterInc.getCurrentBalance()));

        // 3. Create Expense: -2,000 -> balance should be 13,000
        TransactionRequest expenseReq = new TransactionRequest(
                "New Laptop Monitor",
                new BigDecimal("2000.00"),
                TransactionType.EXPENSE,
                null,
                account.getId(),
                LocalDate.now(),
                "Hardware"
        );
        TransactionResponse expTx = transactionService.createTransaction(expenseReq, userA);

        AccountResponse accAfterExp = accountService.getAccountById(account.getId(), userA);
        assertEquals(0, new BigDecimal("13000.00").compareTo(accAfterExp.getCurrentBalance()));

        // 4. Edit Expense Amount: change 2,000 to 3,500 -> balance should be 11,500
        TransactionRequest editAmountReq = new TransactionRequest(
                "New Laptop Monitor Plus Stand",
                new BigDecimal("3500.00"),
                TransactionType.EXPENSE,
                null,
                account.getId(),
                LocalDate.now(),
                "Hardware upgraded"
        );
        transactionService.updateTransaction(expTx.getId(), editAmountReq, userA);

        AccountResponse accAfterEditAmount = accountService.getAccountById(account.getId(), userA);
        assertEquals(0, new BigDecimal("11500.00").compareTo(accAfterEditAmount.getCurrentBalance()));

        // 5. Move transaction to another account (Cash: 0 -> -3,500, Checking: 11,500 -> 15,000)
        AccountRequest cashReq = new AccountRequest(
                "Wallet Cash",
                AccountType.CASH,
                new BigDecimal("1000.00"),
                "INR",
                null, null, null
        );
        AccountResponse cashAccount = accountService.createAccount(cashReq, userA);

        TransactionRequest moveAccountReq = new TransactionRequest(
                "New Laptop Monitor Plus Stand",
                new BigDecimal("3500.00"),
                TransactionType.EXPENSE,
                null,
                cashAccount.getId(),
                LocalDate.now(),
                "Paid in cash"
        );
        transactionService.updateTransaction(expTx.getId(), moveAccountReq, userA);

        AccountResponse checkingRestored = accountService.getAccountById(account.getId(), userA);
        assertEquals(0, new BigDecimal("15000.00").compareTo(checkingRestored.getCurrentBalance()));

        AccountResponse cashDebited = accountService.getAccountById(cashAccount.getId(), userA);
        assertEquals(0, new BigDecimal("-2500.00").compareTo(cashDebited.getCurrentBalance()));

        // 6. Delete transaction from Cash -> Cash balance restored to initial 1,000
        transactionService.deleteTransaction(expTx.getId(), userA);
        AccountResponse cashRestored = accountService.getAccountById(cashAccount.getId(), userA);
        assertEquals(0, new BigDecimal("1000.00").compareTo(cashRestored.getCurrentBalance()));
    }

    @Test
    void security_Isolation_CannotAccessOtherUserAccount() {
        AccountRequest reqA = new AccountRequest(
                "Alice Private Account",
                AccountType.BANK,
                new BigDecimal("50000.00"),
                "INR",
                null, null, null
        );
        AccountResponse aliceAccount = accountService.createAccount(reqA, userA);

        // Bob attempting to get Alice's account must throw ResourceNotFoundException
        assertThrows(ResourceNotFoundException.class, () -> accountService.getAccountById(aliceAccount.getId(), userB));

        // Bob attempting to attach a transaction to Alice's account must throw ResourceNotFoundException
        TransactionRequest bobTx = new TransactionRequest(
                "Bob's Transaction",
                new BigDecimal("100.00"),
                TransactionType.EXPENSE,
                null,
                aliceAccount.getId(),
                LocalDate.now(),
                "Attempted breach"
        );
        assertThrows(ResourceNotFoundException.class, () -> transactionService.createTransaction(bobTx, userB));
    }
}
