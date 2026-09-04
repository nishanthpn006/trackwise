package com.trackwise.service;

import com.trackwise.dto.DashboardSummaryResponse;
import com.trackwise.dto.PagedResponse;
import com.trackwise.dto.TransactionRequest;
import com.trackwise.dto.TransactionResponse;
import com.trackwise.entity.Account;
import com.trackwise.entity.Category;
import com.trackwise.entity.Transaction;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import com.trackwise.exception.ResourceNotFoundException;
import com.trackwise.repository.AccountRepository;
import com.trackwise.repository.CategoryRepository;
import com.trackwise.repository.TransactionRepository;
import com.trackwise.repository.specification.TransactionSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * TransactionService — Transaction CRUD, dynamic searching, filtering, pagination, and dashboard metrics service.
 */
@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final AccountRepository accountRepository;

    public TransactionService(TransactionRepository transactionRepository,
                              CategoryRepository categoryRepository,
                              com.trackwise.repository.AccountRepository accountRepository) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public PagedResponse<TransactionResponse> getTransactions(
            User user,
            String search,
            UUID categoryId,
            TransactionType type,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    ) {
        Specification<Transaction> spec = TransactionSpecification.getFilterSpecification(
                user, search, categoryId, type, startDate, endDate
        );

        Page<Transaction> page = transactionRepository.findAll(spec, pageable);
        Page<TransactionResponse> dtoPage = page.map(TransactionResponse::fromEntity);

        return PagedResponse.fromPage(dtoPage);
    }

    @Transactional(readOnly = true)
    public TransactionResponse getTransactionById(UUID id, User user) {
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with ID: " + id));
        return TransactionResponse.fromEntity(transaction);
    }

    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request, User user) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findByIdAndUser(request.getCategoryId(), user)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));
        }

        com.trackwise.entity.Account account = null;
        if (request.getAccountId() != null) {
            account = accountRepository.findByIdAndUser(request.getAccountId(), user)
                    .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + request.getAccountId()));
        }

        Transaction transaction = new Transaction(
                request.getTitle().trim(),
                request.getAmount(),
                request.getType(),
                request.getDescription(),
                request.getDate(),
                category,
                account,
                user
        );

        Transaction saved = transactionRepository.save(transaction);

        // Adjust and persist account current balance
        if (account != null) {
            applyTransactionToAccount(account, saved.getType(), saved.getAmount());
        }

        return TransactionResponse.fromEntity(saved);
    }

    @Transactional
    public TransactionResponse updateTransaction(UUID id, TransactionRequest request, User user) {
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with ID: " + id));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findByIdAndUser(request.getCategoryId(), user)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));
        }

        Account account = null;
        if (request.getAccountId() != null) {
            account = accountRepository.findByIdAndUser(request.getAccountId(), user)
                    .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + request.getAccountId()));
        }

        // Reverse old transaction impact from old account
        Account oldAccount = transaction.getAccount();
        TransactionType oldType = transaction.getType();
        BigDecimal oldAmount = transaction.getAmount();

        if (oldAccount != null) {
            reverseTransactionFromAccount(oldAccount, oldType, oldAmount);
        }

        // If new account is same as old account, reuse reference with updated balance
        Account targetAccount = account;
        if (oldAccount != null && targetAccount != null && oldAccount.getId().equals(targetAccount.getId())) {
            targetAccount = oldAccount;
        }

        // Apply new transaction impact to target account
        if (targetAccount != null) {
            applyTransactionToAccount(targetAccount, request.getType(), request.getAmount());
        }

        transaction.setTitle(request.getTitle().trim());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDescription(request.getDescription());
        transaction.setDate(request.getDate());
        transaction.setCategory(category);
        transaction.setAccount(targetAccount);

        Transaction updated = transactionRepository.save(transaction);
        return TransactionResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteTransaction(UUID id, User user) {
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with ID: " + id));

        if (transaction.getAccount() != null) {
            reverseTransactionFromAccount(transaction.getAccount(), transaction.getType(), transaction.getAmount());
        }

        transactionRepository.delete(transaction);
    }

    private void applyTransactionToAccount(Account account, TransactionType type, BigDecimal amount) {
        if (account == null || type == null || amount == null) return;
        BigDecimal current = account.getCurrentBalance() != null ? account.getCurrentBalance() : account.getInitialBalance();
        if (current == null) current = BigDecimal.ZERO;
        if (type == TransactionType.INCOME) {
            account.setCurrentBalance(current.add(amount));
        } else if (type == TransactionType.EXPENSE) {
            account.setCurrentBalance(current.subtract(amount));
        }
        accountRepository.save(account);
    }

    private void reverseTransactionFromAccount(Account account, TransactionType type, BigDecimal amount) {
        if (account == null || type == null || amount == null) return;
        BigDecimal current = account.getCurrentBalance() != null ? account.getCurrentBalance() : account.getInitialBalance();
        if (current == null) current = BigDecimal.ZERO;
        if (type == TransactionType.INCOME) {
            account.setCurrentBalance(current.subtract(amount));
        } else if (type == TransactionType.EXPENSE) {
            account.setCurrentBalance(current.add(amount));
        }
        accountRepository.save(account);
    }

    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public DashboardSummaryResponse getDashboardSummary(User user) {
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);
        LocalDate monthEnd = today.withDayOfMonth(today.lengthOfMonth());

        BigDecimal totalIncome = transactionRepository.sumAmountByUserAndType(user, TransactionType.INCOME);
        BigDecimal totalExpense = transactionRepository.sumAmountByUserAndType(user, TransactionType.EXPENSE);

        if (totalIncome == null) totalIncome = BigDecimal.ZERO;
        if (totalExpense == null) totalExpense = BigDecimal.ZERO;

        List<Account> activeAccounts = accountRepository.findByUserAndIsArchivedFalseOrderByCreatedAtDesc(user);
        BigDecimal totalBalance;
        if (!activeAccounts.isEmpty()) {
            totalBalance = activeAccounts.stream()
                    .map(a -> a.getCurrentBalance() != null ? a.getCurrentBalance() : a.getInitialBalance())
                    .filter(java.util.Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        } else {
            totalBalance = totalIncome.subtract(totalExpense);
        }
        BigDecimal savings = totalBalance;

        // Top spending category (all-time)
        LocalDate allTimeStart = LocalDate.of(2000, 1, 1);
        List<Transaction> expenseTxs = transactionRepository
                .findByUserAndTypeAndDateBetween(user, TransactionType.EXPENSE, allTimeStart, today);

        String topCategory = null;
        if (!expenseTxs.isEmpty()) {
            Map<String, BigDecimal> catTotals = new LinkedHashMap<>();
            for (Transaction tx : expenseTxs) {
                String catName = tx.getCategory() != null ? tx.getCategory().getName() : "Uncategorized";
                catTotals.merge(catName, tx.getAmount(), BigDecimal::add);
            }
            topCategory = catTotals.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse(null);
        }

        // Monthly savings percentage = (balance / income) * 100
        BigDecimal monthlySavingsPercentage = BigDecimal.ZERO;
        if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {
            monthlySavingsPercentage = totalBalance
                    .multiply(BigDecimal.valueOf(100))
                    .divide(totalIncome, 1, RoundingMode.HALF_UP);
        }

        // Average daily spend over the last 30 days
        LocalDate trendStart = today.minusDays(29);
        BigDecimal totalExpense30d = transactionRepository.sumAmountByUserAndTypeAndDateBetween(
                user, TransactionType.EXPENSE, trendStart, today);
        if (totalExpense30d == null) totalExpense30d = BigDecimal.ZERO;
        BigDecimal averageDailySpend = totalExpense30d.divide(BigDecimal.valueOf(30), 2, RoundingMode.HALF_UP);

        // Transactions count this month
        long transactionsThisMonth = transactionRepository.countByUserAndDateBetween(user, monthStart, monthEnd);

        List<Transaction> recentEntities = transactionRepository.findTop5ByUserOrderByDateDescCreatedAtDesc(user);
        List<TransactionResponse> recentDtos = recentEntities.stream()
                .map(TransactionResponse::fromEntity)
                .collect(Collectors.toList());

        return new DashboardSummaryResponse(
                totalBalance,
                totalIncome,
                totalExpense,
                savings,
                topCategory,
                monthlySavingsPercentage,
                averageDailySpend,
                transactionsThisMonth,
                recentDtos
        );
    }
}

