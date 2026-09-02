package com.trackwise.service;

import com.trackwise.dto.SubscriptionRequest;
import com.trackwise.dto.SubscriptionResponse;
import com.trackwise.dto.SubscriptionSummaryResponse;
import com.trackwise.entity.Account;
import com.trackwise.entity.BillingCycle;
import com.trackwise.entity.Category;
import com.trackwise.entity.Subscription;
import com.trackwise.entity.SubscriptionStatus;
import com.trackwise.entity.User;
import com.trackwise.exception.ResourceNotFoundException;
import com.trackwise.repository.AccountRepository;
import com.trackwise.repository.CategoryRepository;
import com.trackwise.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final CategoryRepository categoryRepository;
    private final AccountRepository accountRepository;

    public SubscriptionService(SubscriptionRepository subscriptionRepository,
                               CategoryRepository categoryRepository,
                               AccountRepository accountRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional(readOnly = true)
    public List<SubscriptionResponse> getSubscriptions(User user, SubscriptionStatus status) {
        List<Subscription> list = status != null
                ? subscriptionRepository.findByUserAndStatusOrderByNextBillingDateAsc(user, status)
                : subscriptionRepository.findByUserOrderByNextBillingDateAsc(user);

        return list.stream().map(SubscriptionResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SubscriptionResponse getSubscriptionById(UUID id, User user) {
        Subscription sub = subscriptionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));
        return SubscriptionResponse.fromEntity(sub);
    }

    @Transactional(readOnly = true)
    public SubscriptionSummaryResponse getSummary(User user) {
        List<Subscription> activeList = subscriptionRepository.findByUserAndStatusOrderByNextBillingDateAsc(user, SubscriptionStatus.ACTIVE);

        BigDecimal monthlyTotal = BigDecimal.ZERO;
        BigDecimal yearlyTotal = BigDecimal.ZERO;

        for (Subscription sub : activeList) {
            BigDecimal amt = sub.getAmount() != null ? sub.getAmount() : BigDecimal.ZERO;
            if (sub.getBillingCycle() == BillingCycle.MONTHLY) {
                monthlyTotal = monthlyTotal.add(amt);
                yearlyTotal = yearlyTotal.add(amt.multiply(BigDecimal.valueOf(12)));
            } else if (sub.getBillingCycle() == BillingCycle.YEARLY) {
                monthlyTotal = monthlyTotal.add(amt.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP));
                yearlyTotal = yearlyTotal.add(amt);
            } else if (sub.getBillingCycle() == BillingCycle.WEEKLY) {
                monthlyTotal = monthlyTotal.add(amt.multiply(BigDecimal.valueOf(4.33)).setScale(2, RoundingMode.HALF_UP));
                yearlyTotal = yearlyTotal.add(amt.multiply(BigDecimal.valueOf(52)));
            }
        }

        LocalDate now = LocalDate.now();
        LocalDate in30Days = now.plusDays(30);

        List<SubscriptionResponse> upcoming = activeList.stream()
                .filter(s -> s.getNextBillingDate() != null && !s.getNextBillingDate().isBefore(now) && !s.getNextBillingDate().isAfter(in30Days))
                .map(SubscriptionResponse::fromEntity)
                .collect(Collectors.toList());

        return new SubscriptionSummaryResponse(monthlyTotal, yearlyTotal, activeList.size(), upcoming);
    }

    public SubscriptionResponse createSubscription(SubscriptionRequest request, User user) {
        Category category = resolveCategory(request.getCategoryId(), user);
        Account account = resolveAccount(request.getAccountId(), user);

        Subscription sub = new Subscription(
                request.getName().trim(),
                request.getAmount(),
                request.getBillingCycle(),
                request.getNextBillingDate(),
                request.getStatus(),
                request.getDescription(),
                request.getReminderDaysBefore(),
                category,
                account,
                user
        );

        Subscription saved = subscriptionRepository.save(sub);
        return SubscriptionResponse.fromEntity(saved);
    }

    public SubscriptionResponse updateSubscription(UUID id, SubscriptionRequest request, User user) {
        Subscription sub = subscriptionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));

        Category category = resolveCategory(request.getCategoryId(), user);
        Account account = resolveAccount(request.getAccountId(), user);

        sub.setName(request.getName().trim());
        sub.setAmount(request.getAmount());
        sub.setBillingCycle(request.getBillingCycle());
        sub.setNextBillingDate(request.getNextBillingDate());
        if (request.getStatus() != null) sub.setStatus(request.getStatus());
        sub.setDescription(request.getDescription());
        if (request.getReminderDaysBefore() != null) sub.setReminderDaysBefore(request.getReminderDaysBefore());
        sub.setCategory(category);
        sub.setAccount(account);

        Subscription updated = subscriptionRepository.save(sub);
        return SubscriptionResponse.fromEntity(updated);
    }

    public SubscriptionResponse updateStatus(UUID id, SubscriptionStatus status, User user) {
        Subscription sub = subscriptionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));

        sub.setStatus(status);
        Subscription updated = subscriptionRepository.save(sub);
        return SubscriptionResponse.fromEntity(updated);
    }

    @SuppressWarnings("null")
    public void deleteSubscription(UUID id, User user) {
        Subscription sub = subscriptionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));
        subscriptionRepository.delete(sub);
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
