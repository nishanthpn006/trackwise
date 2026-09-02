package com.trackwise.service;

import com.trackwise.dto.BillReminderRequest;
import com.trackwise.dto.BillReminderResponse;
import com.trackwise.entity.Account;
import com.trackwise.entity.BillReminder;
import com.trackwise.entity.BillStatus;
import com.trackwise.entity.Category;
import com.trackwise.entity.Transaction;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import com.trackwise.exception.ResourceNotFoundException;
import com.trackwise.repository.AccountRepository;
import com.trackwise.repository.BillReminderRepository;
import com.trackwise.repository.CategoryRepository;
import com.trackwise.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class BillReminderService {

    private final BillReminderRepository billReminderRepository;
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final AccountRepository accountRepository;

    public BillReminderService(BillReminderRepository billReminderRepository,
                               TransactionRepository transactionRepository,
                               CategoryRepository categoryRepository,
                               AccountRepository accountRepository) {
        this.billReminderRepository = billReminderRepository;
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional(readOnly = true)
    public List<BillReminderResponse> getBillReminders(User user, BillStatus status) {
        List<BillReminder> list = status != null
                ? billReminderRepository.findByUserAndStatusOrderByDueDateAsc(user, status)
                : billReminderRepository.findByUserOrderByDueDateAsc(user);

        // Dynamically compute DUE_SOON and OVERDUE for non-paid bills
        LocalDate today = LocalDate.now();
        for (BillReminder bill : list) {
            if (bill.getStatus() != BillStatus.PAID) {
                long days = ChronoUnit.DAYS.between(today, bill.getDueDate());
                if (days < 0) {
                    bill.setStatus(BillStatus.OVERDUE);
                } else if (days <= 3) {
                    bill.setStatus(BillStatus.DUE_SOON);
                } else {
                    bill.setStatus(BillStatus.UPCOMING);
                }
            }
        }

        return list.stream().map(BillReminderResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BillReminderResponse getBillReminderById(UUID id, User user) {
        BillReminder bill = billReminderRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Bill reminder not found with id: " + id));
        return BillReminderResponse.fromEntity(bill);
    }

    public BillReminderResponse createBillReminder(BillReminderRequest request, User user) {
        Category category = resolveCategory(request.getCategoryId(), user);
        Account account = resolveAccount(request.getAccountId(), user);

        BillStatus status = request.getStatus() != null ? request.getStatus() : calculateInitialStatus(request.getDueDate());

        BillReminder bill = new BillReminder(
                request.getTitle().trim(),
                request.getAmount(),
                request.getDueDate(),
                request.getFrequency(),
                status,
                request.getNotes(),
                category,
                account,
                user
        );

        BillReminder saved = billReminderRepository.save(bill);
        return BillReminderResponse.fromEntity(saved);
    }

    public BillReminderResponse updateBillReminder(UUID id, BillReminderRequest request, User user) {
        BillReminder bill = billReminderRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Bill reminder not found with id: " + id));

        Category category = resolveCategory(request.getCategoryId(), user);
        Account account = resolveAccount(request.getAccountId(), user);

        bill.setTitle(request.getTitle().trim());
        bill.setAmount(request.getAmount());
        bill.setDueDate(request.getDueDate());
        if (request.getFrequency() != null) bill.setFrequency(request.getFrequency());
        if (request.getStatus() != null) {
            bill.setStatus(request.getStatus());
        } else if (bill.getStatus() != BillStatus.PAID) {
            bill.setStatus(calculateInitialStatus(request.getDueDate()));
        }
        bill.setNotes(request.getNotes());
        bill.setCategory(category);
        bill.setAccount(account);

        BillReminder updated = billReminderRepository.save(bill);
        return BillReminderResponse.fromEntity(updated);
    }

    /**
     * Marks a bill as paid and logs a corresponding Expense transaction.
     */
    public BillReminderResponse markAsPaid(UUID id, boolean recordTransaction, User user) {
        BillReminder bill = billReminderRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Bill reminder not found with id: " + id));

        bill.setStatus(BillStatus.PAID);
        bill.setPaidAt(LocalDateTime.now());

        if (recordTransaction) {
            Transaction tx = new Transaction(
                    bill.getTitle() + " (Bill Payment)",
                    bill.getAmount(),
                    TransactionType.EXPENSE,
                    bill.getNotes(),
                    LocalDate.now(),
                    bill.getCategory(),
                    bill.getAccount(),
                    user
            );
            transactionRepository.save(tx);
        }

        BillReminder saved = billReminderRepository.save(bill);
        return BillReminderResponse.fromEntity(saved);
    }

    @SuppressWarnings("null")
    public void deleteBillReminder(UUID id, User user) {
        BillReminder bill = billReminderRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Bill reminder not found with id: " + id));
        billReminderRepository.delete(bill);
    }


    private BillStatus calculateInitialStatus(LocalDate dueDate) {
        long days = ChronoUnit.DAYS.between(LocalDate.now(), dueDate);
        if (days < 0) return BillStatus.OVERDUE;
        if (days <= 3) return BillStatus.DUE_SOON;
        return BillStatus.UPCOMING;
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
