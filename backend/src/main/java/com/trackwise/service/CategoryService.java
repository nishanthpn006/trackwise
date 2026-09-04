package com.trackwise.service;

import com.trackwise.dto.CategoryRequest;
import com.trackwise.dto.CategoryResponse;
import com.trackwise.entity.Category;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import com.trackwise.exception.ResourceNotFoundException;
import com.trackwise.repository.CategoryRepository;
import com.trackwise.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * CategoryService — Category management business service.
 */
@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;

    public CategoryService(CategoryRepository categoryRepository, TransactionRepository transactionRepository) {
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public List<CategoryResponse> getCategories(User user, TransactionType type) {
        ensureDefaultCategoriesExist(user);

        List<Category> categories;
        if (type != null) {
            categories = categoryRepository.findByUserAndType(user, type);
        } else {
            categories = categoryRepository.findByUser(user);
        }

        return categories.stream()
                .map(CategoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(UUID id, User user) {
        Category category = categoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        return CategoryResponse.fromEntity(category);
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request, User user) {
        String name = request.getName().trim();
        if (categoryRepository.existsByUserAndNameIgnoreCase(user, name)) {
            throw new IllegalArgumentException("Category with name '" + name + "' already exists");
        }

        Category category = new Category(
                name,
                request.getType(),
                request.getIcon(),
                request.getColor(),
                request.getDescription() != null ? request.getDescription().trim() : null,
                user
        );
        Category savedCategory = categoryRepository.save(category);
        return CategoryResponse.fromEntity(savedCategory);
    }

    @Transactional
    public CategoryResponse updateCategory(UUID id, CategoryRequest request, User user) {
        Category category = categoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        String newName = request.getName().trim();
        if (categoryRepository.existsByUserAndNameIgnoreCaseAndIdNot(user, newName, id)) {
            throw new IllegalArgumentException("Category with name '" + newName + "' already exists");
        }

        category.setName(newName);
        category.setType(request.getType());
        category.setIcon(request.getIcon());
        category.setColor(request.getColor());
        category.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);

        Category updated = categoryRepository.save(category);
        return CategoryResponse.fromEntity(updated);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteCategory(UUID id, User user) {
        Category category = categoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        long transactionCount = transactionRepository.countByCategory(category);
        if (transactionCount > 0) {
            throw new IllegalArgumentException("Cannot delete category associated with " + transactionCount + " transactions. Reassign or delete transactions first.");
        }

        categoryRepository.delete(category);
    }

    @Transactional
    @SuppressWarnings("null")
    public void seedDefaultCategories(User user) {
        List<Category> existing = categoryRepository.findByUser(user);
        if (existing.isEmpty()) {
            List<Category> defaults = Arrays.asList(
                    new Category("Salary", TransactionType.INCOME, "wallet", "#10B981", "Regular employment and monthly wages", user),
                    new Category("Freelance & Business", TransactionType.INCOME, "briefcase", "#3B82F6", "Client contracts, side gigs, and consulting", user),
                    new Category("Investments", TransactionType.INCOME, "trending-up", "#8B5CF6", "Dividends, capital gains, and interest", user),
                    new Category("Other Income", TransactionType.INCOME, "plus-circle", "#06B6D4", "Gifts, refunds, and miscellaneous earnings", user),
                    new Category("Food & Dining", TransactionType.EXPENSE, "utensils", "#EF4444", "Groceries, dining out, and beverages", user),
                    new Category("Transportation", TransactionType.EXPENSE, "car", "#EC4899", "Fuel, public transit, and vehicle maintenance", user),
                    new Category("Shopping & Retail", TransactionType.EXPENSE, "shopping-bag", "#F59E0B", "Clothing, electronics, and personal goods", user),
                    new Category("Bills & Utilities", TransactionType.EXPENSE, "file-text", "#6366F1", "Electricity, water, internet, and mobile recharges", user),
                    new Category("Entertainment", TransactionType.EXPENSE, "film", "#14B8A6", "Movies, gaming, subscriptions, and leisure", user),
                    new Category("Other Expense", TransactionType.EXPENSE, "more-horizontal", "#64748B", "General or unclassified expenses", user)
            );
            categoryRepository.saveAll(defaults);
        }
    }

    @SuppressWarnings("null")
    private void ensureDefaultCategoriesExist(User user) {
        seedDefaultCategories(user);
    }
}
