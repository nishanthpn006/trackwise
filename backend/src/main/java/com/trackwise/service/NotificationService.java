package com.trackwise.service;

import com.trackwise.dto.NotificationResponse;
import com.trackwise.dto.NotificationSummaryResponse;
import com.trackwise.entity.Budget;
import com.trackwise.entity.Goal;
import com.trackwise.entity.Notification;
import com.trackwise.entity.NotificationPriority;
import com.trackwise.entity.NotificationType;
import com.trackwise.entity.Transaction;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import com.trackwise.exception.ResourceNotFoundException;
import com.trackwise.repository.BudgetRepository;
import com.trackwise.repository.GoalRepository;
import com.trackwise.repository.NotificationRepository;
import com.trackwise.repository.TransactionRepository;
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
@SuppressWarnings("null")
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final BudgetRepository budgetRepository;
    private final GoalRepository goalRepository;
    private final TransactionRepository transactionRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               BudgetRepository budgetRepository,
                               GoalRepository goalRepository,
                               TransactionRepository transactionRepository) {
        this.notificationRepository = notificationRepository;
        this.budgetRepository = budgetRepository;
        this.goalRepository = goalRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(User user, Boolean unreadOnly, String typeStr, String search) {
        List<Notification> list;
        if (Boolean.TRUE.equals(unreadOnly)) {
            list = notificationRepository.findByUserAndIsReadOrderByCreatedAtDesc(user, false);
        } else {
            list = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        }

        if (typeStr != null && !typeStr.trim().isEmpty() && !"ALL".equalsIgnoreCase(typeStr)) {
            try {
                NotificationType filterType = NotificationType.valueOf(typeStr.toUpperCase());
                list = list.stream().filter(n -> n.getType() == filterType).collect(Collectors.toList());
            } catch (IllegalArgumentException ignored) {
                // Ignore invalid type filter
            }
        }

        if (search != null && !search.trim().isEmpty()) {
            String query = search.toLowerCase().trim();
            list = list.stream().filter(n ->
                n.getTitle().toLowerCase().contains(query) ||
                n.getMessage().toLowerCase().contains(query)
            ).collect(Collectors.toList());
        }

        return list.stream().map(NotificationResponse::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    @Transactional(readOnly = true)
    public NotificationSummaryResponse getSummary(User user) {
        List<NotificationResponse> all = getUserNotifications(user, false, null, null);
        long unread = getUnreadCount(user);
        return new NotificationSummaryResponse(all.size(), unread, all);
    }

    public NotificationResponse markAsRead(User user, UUID notificationId) {
        Notification notification = notificationRepository.findByIdAndUser(notificationId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        notification.setRead(true);
        Notification updated = notificationRepository.save(notification);
        return new NotificationResponse(updated);
    }

    public void markAllAsRead(User user) {
        List<Notification> unreadList = notificationRepository.findByUserAndIsReadOrderByCreatedAtDesc(user, false);
        for (Notification n : unreadList) {
            n.setRead(true);
        }
        notificationRepository.saveAll(unreadList);
    }

    public void deleteNotification(User user, UUID notificationId) {
        Notification notification = notificationRepository.findByIdAndUser(notificationId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));
        notificationRepository.delete(notification);
    }

    public void clearAllNotifications(User user) {
        notificationRepository.deleteAllByUser(user);
    }

    public NotificationResponse createNotification(User user, String title, String message, NotificationType type, NotificationPriority priority, String actionUrl) {
        Notification n = new Notification(user, title, message, type, priority, actionUrl);
        Notification saved = notificationRepository.save(n);
        return new NotificationResponse(saved);
    }

    public void generateSystemNotificationsForUser(User user) {
        // 1. Evaluate Budgets against user's actual expenses
        List<Budget> budgets = budgetRepository.findAllByUserOrderByCreatedAtDesc(user);
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        LocalDate endOfMonth = now.withDayOfMonth(now.lengthOfMonth());

        List<Transaction> monthExpenses = transactionRepository.findByUserAndDateBetween(user, startOfMonth, endOfMonth)
                .stream().filter(t -> t.getType() == TransactionType.EXPENSE).collect(Collectors.toList());

        for (Budget b : budgets) {
            if (b.getAmount() != null && b.getAmount().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal spent = BigDecimal.ZERO;
                if (b.getCategory() != null) {
                    spent = monthExpenses.stream()
                            .filter(t -> t.getCategory() != null && t.getCategory().getId().equals(b.getCategory().getId()))
                            .map(Transaction::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                } else {
                    spent = monthExpenses.stream()
                            .map(Transaction::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                }

                double percentage = spent.divide(b.getAmount(), 4, RoundingMode.HALF_UP).doubleValue() * 100;
                String categoryName = b.getCategory() != null ? b.getCategory().getName() : b.getName();

                if (percentage >= 100) {
                    String title = "Budget Exceeded: " + categoryName;
                    if (!notificationRepository.existsByUserAndTypeAndTitle(user, NotificationType.BUDGET_ALERT, title)) {
                        createNotification(user, title,
                                String.format("You have exceeded your monthly budget for %s (%d%% spent).", categoryName, (int) percentage),
                                NotificationType.BUDGET_ALERT, NotificationPriority.URGENT, "/budgets");
                    }
                } else if (percentage >= 90) {
                    String title = "Budget Warning 90%: " + categoryName;
                    if (!notificationRepository.existsByUserAndTypeAndTitle(user, NotificationType.OVERSPENDING_ALERT, title)) {
                        createNotification(user, title,
                                String.format("You have used 90%% of your budget for %s.", categoryName),
                                NotificationType.OVERSPENDING_ALERT, NotificationPriority.HIGH, "/budgets");
                    }
                } else if (percentage >= 80) {
                    String title = "Budget Alert 80%: " + categoryName;
                    if (!notificationRepository.existsByUserAndTypeAndTitle(user, NotificationType.BUDGET_ALERT, title)) {
                        createNotification(user, title,
                                String.format("You have reached 80%% of your budget for %s.", categoryName),
                                NotificationType.BUDGET_ALERT, NotificationPriority.MEDIUM, "/budgets");
                    }
                }
            }
        }

        // 2. Evaluate Goals
        List<Goal> goals = goalRepository.findByUserOrderByTargetDateAsc(user);
        for (Goal g : goals) {
            if (g.getTargetAmount() != null && g.getTargetAmount().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal current = g.getCurrentAmount() != null ? g.getCurrentAmount() : BigDecimal.ZERO;
                double percentage = current.divide(g.getTargetAmount(), 4, RoundingMode.HALF_UP).doubleValue() * 100;

                if (percentage >= 100) {
                    String title = "Goal Achieved: " + g.getName();
                    if (!notificationRepository.existsByUserAndTypeAndTitle(user, NotificationType.GOAL_ACHIEVED, title)) {
                        createNotification(user, title,
                                String.format("Congratulations! You achieved your savings goal '%s'!", g.getName()),
                                NotificationType.GOAL_ACHIEVED, NotificationPriority.HIGH, "/goals");
                    }
                } else if (percentage >= 75) {
                    String title = "Goal Milestone 75%: " + g.getName();
                    if (!notificationRepository.existsByUserAndTypeAndTitle(user, NotificationType.GOAL_MILESTONE, title)) {
                        createNotification(user, title,
                                String.format("Great progress! You are 75%% towards '%s'.", g.getName()),
                                NotificationType.GOAL_MILESTONE, NotificationPriority.MEDIUM, "/goals");
                    }
                } else if (percentage >= 50) {
                    String title = "Goal Milestone 50%: " + g.getName();
                    if (!notificationRepository.existsByUserAndTypeAndTitle(user, NotificationType.GOAL_MILESTONE, title)) {
                        createNotification(user, title,
                                String.format("You have reached halfway (50%%) on your '%s' goal!", g.getName()),
                                NotificationType.GOAL_MILESTONE, NotificationPriority.LOW, "/goals");
                    }
                }
            }
        }
    }
}
