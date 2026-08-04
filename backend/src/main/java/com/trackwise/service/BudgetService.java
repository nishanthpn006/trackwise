package com.trackwise.service;

import com.trackwise.dto.BudgetRequest;
import com.trackwise.dto.BudgetResponse;
import com.trackwise.entity.Budget;
import com.trackwise.entity.Category;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import com.trackwise.exception.ResourceNotFoundException;
import com.trackwise.repository.BudgetRepository;
import com.trackwise.repository.CategoryRepository;
import com.trackwise.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * BudgetService — Business logic for budget CRUD and spent-amount computation.
 *
 * <p>The {@code spent} amount is computed on every read by summing expense
 * transactions that fall within the budget's startDate–endDate window.
 * For category-scoped budgets only matching category transactions are counted;
 * for general budgets all expense transactions in the window are counted.</p>
 */
@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;

    public BudgetService(BudgetRepository budgetRepository,
                         CategoryRepository categoryRepository,
                         TransactionRepository transactionRepository) {
        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
    }

    // ─── Read ─────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<BudgetResponse> getBudgets(User user) {
        return budgetRepository.findAllByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(budget -> BudgetResponse.fromEntity(budget, computeSpent(budget, user)))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BudgetResponse getBudgetById(UUID id, User user) {
        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with ID: " + id));
        return BudgetResponse.fromEntity(budget, computeSpent(budget, user));
    }

    // ─── Create ───────────────────────────────────────────────────────────────

    @Transactional
    public BudgetResponse createBudget(BudgetRequest request, User user) {
        String name = request.getName().trim();

        if (budgetRepository.existsByNameAndUser(name, user)) {
            throw new IllegalArgumentException("Budget with name '" + name + "' already exists");
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("End date must be on or after start date");
        }

        Category category = resolveCategory(request.getCategoryId(), user);

        Budget budget = new Budget(
                name,
                request.getAmount(),
                request.getPeriod(),
                request.getStartDate(),
                request.getEndDate(),
                category,
                user
        );

        Budget saved = budgetRepository.save(budget);
        return BudgetResponse.fromEntity(saved, computeSpent(saved, user));
    }

    // ─── Update ───────────────────────────────────────────────────────────────

    @Transactional
    public BudgetResponse updateBudget(UUID id, BudgetRequest request, User user) {
        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with ID: " + id));

        String newName = request.getName().trim();
        if (budgetRepository.existsByNameAndUserAndIdNot(newName, user, id)) {
            throw new IllegalArgumentException("Budget with name '" + newName + "' already exists");
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("End date must be on or after start date");
        }

        Category category = resolveCategory(request.getCategoryId(), user);

        budget.setName(newName);
        budget.setAmount(request.getAmount());
        budget.setPeriod(request.getPeriod());
        budget.setStartDate(request.getStartDate());
        budget.setEndDate(request.getEndDate());
        budget.setCategory(category);

        Budget updated = budgetRepository.save(budget);
        return BudgetResponse.fromEntity(updated, computeSpent(updated, user));
    }

    // ─── Delete ───────────────────────────────────────────────────────────────

    @Transactional
    @SuppressWarnings("null")
    public void deleteBudget(UUID id, User user) {
        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with ID: " + id));
        budgetRepository.delete(budget);
    }

    // ─── Private Helpers ──────────────────────────────────────────────────────

    /**
     * Computes spent amount for a budget by summing EXPENSE transactions in the
     * budget's date range. If the budget has a linked category, only transactions
     * matching that category are included.
     */
    private BigDecimal computeSpent(Budget budget, User user) {
        if (budget.getCategory() != null) {
            // Category-scoped: sum only matching category expenses in date range
            return transactionRepository
                    .findByUserAndTypeAndDateBetween(user, TransactionType.EXPENSE,
                            budget.getStartDate(), budget.getEndDate())
                    .stream()
                    .filter(tx -> tx.getCategory() != null
                            && tx.getCategory().getId().equals(budget.getCategory().getId()))
                    .map(tx -> tx.getAmount() != null ? tx.getAmount() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, (a, b) -> a.add(b));
        } else {
            // General budget: sum all expenses in date range
            return transactionRepository.sumAmountByUserAndTypeAndDateBetween(
                    user, TransactionType.EXPENSE,
                    budget.getStartDate(), budget.getEndDate());
        }
    }

    /**
     * Resolves an optional categoryId to a Category entity, validating ownership.
     * Returns null if categoryId is null.
     */
    private Category resolveCategory(UUID categoryId, User user) {
        if (categoryId == null) return null;
        return categoryRepository.findByIdAndUser(categoryId, user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with ID: " + categoryId));
    }
}
