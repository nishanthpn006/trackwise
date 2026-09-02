package com.trackwise.service;

import com.trackwise.dto.RecurringTransactionRequest;
import com.trackwise.dto.RecurringTransactionResponse;
import com.trackwise.entity.Account;
import com.trackwise.entity.Category;
import com.trackwise.entity.RecurringTransaction;
import com.trackwise.entity.Transaction;
import com.trackwise.entity.User;
import com.trackwise.exception.ResourceNotFoundException;
import com.trackwise.repository.AccountRepository;
import com.trackwise.repository.CategoryRepository;
import com.trackwise.repository.RecurringTransactionRepository;
import com.trackwise.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class RecurringTransactionService {

    private final RecurringTransactionRepository recurringTransactionRepository;
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final AccountRepository accountRepository;

    public RecurringTransactionService(RecurringTransactionRepository recurringTransactionRepository,
                                       TransactionRepository transactionRepository,
                                       CategoryRepository categoryRepository,
                                       AccountRepository accountRepository) {
        this.recurringTransactionRepository = recurringTransactionRepository;
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional(readOnly = true)
    public List<RecurringTransactionResponse> getRecurringTransactions(User user) {
        return recurringTransactionRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(RecurringTransactionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RecurringTransactionResponse getRecurringTransactionById(UUID id, User user) {
        RecurringTransaction rt = recurringTransactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring transaction not found with id: " + id));
        return RecurringTransactionResponse.fromEntity(rt);
    }

    public RecurringTransactionResponse createRecurringTransaction(RecurringTransactionRequest request, User user) {
        Category category = resolveCategory(request.getCategoryId(), user);
        Account account = resolveAccount(request.getAccountId(), user);

        LocalDate nextExec = request.getNextExecutionDate() != null ? request.getNextExecutionDate() : request.getStartDate();

        RecurringTransaction rt = new RecurringTransaction(
                request.getTitle().trim(),
                request.getAmount(),
                request.getType(),
                request.getFrequency(),
                request.getStartDate(),
                nextExec,
                request.getEndDate(),
                category,
                account,
                request.getDescription(),
                user
        );

        RecurringTransaction saved = recurringTransactionRepository.save(rt);
        return RecurringTransactionResponse.fromEntity(saved);
    }

    public RecurringTransactionResponse updateRecurringTransaction(UUID id, RecurringTransactionRequest request, User user) {
        RecurringTransaction rt = recurringTransactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring transaction not found with id: " + id));

        Category category = resolveCategory(request.getCategoryId(), user);
        Account account = resolveAccount(request.getAccountId(), user);

        rt.setTitle(request.getTitle().trim());
        rt.setAmount(request.getAmount());
        rt.setType(request.getType());
        rt.setFrequency(request.getFrequency());
        rt.setStartDate(request.getStartDate());
        if (request.getNextExecutionDate() != null) {
            rt.setNextExecutionDate(request.getNextExecutionDate());
        }
        rt.setEndDate(request.getEndDate());
        rt.setCategory(category);
        rt.setAccount(account);
        rt.setDescription(request.getDescription());

        RecurringTransaction updated = recurringTransactionRepository.save(rt);
        return RecurringTransactionResponse.fromEntity(updated);
    }

    public RecurringTransactionResponse toggleActive(UUID id, User user) {
        RecurringTransaction rt = recurringTransactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring transaction not found with id: " + id));

        rt.setActive(!rt.isActive());
        RecurringTransaction saved = recurringTransactionRepository.save(rt);
        return RecurringTransactionResponse.fromEntity(saved);
    }

    @SuppressWarnings("null")
    public void deleteRecurringTransaction(UUID id, User user) {
        RecurringTransaction rt = recurringTransactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring transaction not found with id: " + id));
        recurringTransactionRepository.delete(rt);
    }


    /**
     * Processes due recurring transactions for a user up to today, generating concrete Transaction records.
     * Guaranteed duplicate-safe.
     */
    public List<RecurringTransactionResponse> processDueForUser(User user) {
        LocalDate today = LocalDate.now();
        List<RecurringTransaction> dueList = recurringTransactionRepository.findByUserAndIsActiveTrueOrderByNextExecutionDateAsc(user)
                .stream()
                .filter(rt -> !rt.getNextExecutionDate().isAfter(today))
                .collect(Collectors.toList());

        List<RecurringTransaction> processed = new ArrayList<>();
        for (RecurringTransaction rt : dueList) {
            if (rt.getEndDate() != null && rt.getNextExecutionDate().isAfter(rt.getEndDate())) {
                rt.setActive(false);
                recurringTransactionRepository.save(rt);
                continue;
            }

            // Create concrete transaction
            Transaction tx = new Transaction(
                    rt.getTitle() + " (Recurring)",
                    rt.getAmount(),
                    rt.getType(),
                    rt.getDescription(),
                    rt.getNextExecutionDate(),
                    rt.getCategory(),
                    rt.getAccount(),
                    user
            );
            transactionRepository.save(tx);

            // Compute next execution date safely
            LocalDate nextDate = advanceDate(rt.getNextExecutionDate(), rt.getFrequency());
            rt.setLastExecutedAt(LocalDateTime.now());
            rt.setNextExecutionDate(nextDate);

            if (rt.getEndDate() != null && nextDate.isAfter(rt.getEndDate())) {
                rt.setActive(false);
            }

            processed.add(recurringTransactionRepository.save(rt));
        }

        return processed.stream().map(RecurringTransactionResponse::fromEntity).collect(Collectors.toList());
    }

    private LocalDate advanceDate(LocalDate current, com.trackwise.entity.RecurrenceFrequency freq) {
        return switch (freq) {
            case DAILY -> current.plusDays(1);
            case WEEKLY -> current.plusWeeks(1);
            case MONTHLY -> current.plusMonths(1);
            case YEARLY -> current.plusYears(1);
        };
    }

    private Category resolveCategory(UUID categoryId, User user) {
        if (categoryId == null) return null;
        return categoryRepository.findByIdAndUser(categoryId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
    }

    private Account resolveAccount(UUID accountId, User user) {
        if (accountId == null) return null;
        return accountRepository.findByIdAndUser(accountId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));
    }
}
