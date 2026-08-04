package com.trackwise.service;

import com.trackwise.dto.DashboardSummaryResponse;
import com.trackwise.dto.PagedResponse;
import com.trackwise.dto.TransactionRequest;
import com.trackwise.dto.TransactionResponse;
import com.trackwise.entity.Category;
import com.trackwise.entity.Transaction;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import com.trackwise.exception.ResourceNotFoundException;
import com.trackwise.repository.CategoryRepository;
import com.trackwise.repository.TransactionRepository;
import com.trackwise.repository.specification.TransactionSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * TransactionService — Transaction CRUD, dynamic searching, filtering, pagination, and dashboard metrics service.
 */
@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    public TransactionService(TransactionRepository transactionRepository, CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
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

        Transaction transaction = new Transaction(
                request.getTitle().trim(),
                request.getAmount(),
                request.getType(),
                request.getDescription(),
                request.getDate(),
                category,
                user
        );

        Transaction saved = transactionRepository.save(transaction);
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

        transaction.setTitle(request.getTitle().trim());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDescription(request.getDescription());
        transaction.setDate(request.getDate());
        transaction.setCategory(category);

        Transaction updated = transactionRepository.save(transaction);
        return TransactionResponse.fromEntity(updated);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteTransaction(UUID id, User user) {
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with ID: " + id));
        transactionRepository.delete(transaction);
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary(User user) {
        BigDecimal totalIncome = transactionRepository.sumAmountByUserAndType(user, TransactionType.INCOME);
        BigDecimal totalExpense = transactionRepository.sumAmountByUserAndType(user, TransactionType.EXPENSE);

        if (totalIncome == null) totalIncome = BigDecimal.ZERO;
        if (totalExpense == null) totalExpense = BigDecimal.ZERO;

        BigDecimal balance = totalIncome.subtract(totalExpense);

        List<Transaction> recentEntities = transactionRepository.findTop5ByUserOrderByDateDescCreatedAtDesc(user);
        List<TransactionResponse> recentDtos = recentEntities.stream()
                .map(TransactionResponse::fromEntity)
                .collect(Collectors.toList());

        return new DashboardSummaryResponse(totalIncome, totalExpense, balance, recentDtos);
    }
}
