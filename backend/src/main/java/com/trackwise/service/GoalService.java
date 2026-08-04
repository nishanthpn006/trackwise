package com.trackwise.service;

import com.trackwise.dto.GoalContributionRequest;
import com.trackwise.dto.GoalContributionResponse;
import com.trackwise.dto.GoalRequest;
import com.trackwise.dto.GoalResponse;
import com.trackwise.dto.GoalSummaryResponse;
import com.trackwise.entity.Goal;
import com.trackwise.entity.GoalContribution;
import com.trackwise.entity.GoalStatus;
import com.trackwise.entity.User;
import com.trackwise.exception.ResourceNotFoundException;
import com.trackwise.repository.GoalContributionRepository;
import com.trackwise.repository.GoalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class GoalService {

    private final GoalRepository goalRepository;
    private final GoalContributionRepository goalContributionRepository;

    public GoalService(GoalRepository goalRepository, GoalContributionRepository goalContributionRepository) {
        this.goalRepository = goalRepository;
        this.goalContributionRepository = goalContributionRepository;
    }

    @Transactional(readOnly = true)
    public List<GoalResponse> getGoals(User user) {
        return goalRepository.findByUserOrderByTargetDateAsc(user).stream()
                .map(GoalResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GoalResponse getGoalById(UUID id, User user) {
        Goal goal = goalRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with ID: " + id));
        return new GoalResponse(goal);
    }

    public GoalResponse createGoal(GoalRequest request, User user) {
        validateGoalRequest(request);

        Goal goal = new Goal(
                request.getName(),
                request.getTargetAmount(),
                request.getCurrentAmount() != null ? request.getCurrentAmount() : BigDecimal.ZERO,
                request.getTargetDate(),
                request.getCategory(),
                request.getIcon(),
                request.getColor(),
                request.getDescription(),
                user
        );

        // If an initial current amount is provided > 0, log an initial contribution
        if (request.getCurrentAmount() != null && request.getCurrentAmount().compareTo(BigDecimal.ZERO) > 0) {
            GoalContribution initialContrib = new GoalContribution(
                    goal,
                    request.getCurrentAmount(),
                    LocalDate.now(),
                    "Initial savings deposit"
            );
            goal.addContribution(initialContrib);
        }

        Goal saved = goalRepository.save(goal);
        return new GoalResponse(saved);
    }

    public GoalResponse updateGoal(UUID id, GoalRequest request, User user) {
        validateGoalRequest(request);

        Goal goal = goalRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with ID: " + id));

        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        if (request.getCurrentAmount() != null) {
            goal.setCurrentAmount(request.getCurrentAmount());
        }
        goal.setTargetDate(request.getTargetDate());
        goal.setCategory(request.getCategory());
        goal.setIcon(request.getIcon());
        goal.setColor(request.getColor());
        goal.setDescription(request.getDescription());

        Goal updated = goalRepository.save(goal);
        return new GoalResponse(updated);
    }

    public void deleteGoal(UUID id, User user) {
        Goal goal = goalRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with ID: " + id));
        goalRepository.delete(goal);
    }

    public GoalResponse addContribution(UUID goalId, GoalContributionRequest request, User user) {
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Contribution amount must be greater than zero");
        }

        Goal goal = goalRepository.findByIdAndUser(goalId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with ID: " + goalId));

        BigDecimal newCurrent = goal.getCurrentAmount().add(request.getAmount());
        goal.setCurrentAmount(newCurrent);

        LocalDate contribDate = request.getDate() != null ? request.getDate() : LocalDate.now();
        GoalContribution contrib = new GoalContribution(goal, request.getAmount(), contribDate, request.getNotes());
        goal.addContribution(contrib);

        Goal saved = goalRepository.save(goal);
        return new GoalResponse(saved);
    }

    @Transactional(readOnly = true)
    public GoalSummaryResponse getGoalSummary(User user) {
        List<Goal> goals = goalRepository.findByUserOrderByTargetDateAsc(user);

        long totalGoals = goals.size();
        long activeGoals = 0;
        long completedGoals = 0;
        long overdueGoals = 0;
        BigDecimal totalTarget = BigDecimal.ZERO;
        BigDecimal totalSaved = BigDecimal.ZERO;
        long upcomingDeadlines = 0;

        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysFromNow = today.plusDays(30);
        Goal nearestGoalEntity = null;

        for (Goal g : goals) {
            GoalResponse resp = new GoalResponse(g);
            totalTarget = totalTarget.add(resp.getTargetAmount());
            totalSaved = totalSaved.add(resp.getCurrentAmount());

            if (resp.getStatus() == GoalStatus.COMPLETED) {
                completedGoals++;
            } else if (resp.getStatus() == GoalStatus.OVERDUE) {
                overdueGoals++;
                activeGoals++; // Still considered active/unresolved
            } else {
                activeGoals++;
            }

            if (resp.getStatus() != GoalStatus.COMPLETED) {
                if (g.getTargetDate() != null) {
                    if (!g.getTargetDate().isBefore(today) && g.getTargetDate().isBefore(thirtyDaysFromNow)) {
                        upcomingDeadlines++;
                    }
                    if (nearestGoalEntity == null || g.getTargetDate().isBefore(nearestGoalEntity.getTargetDate())) {
                        nearestGoalEntity = g;
                    }
                }
            }
        }

        BigDecimal remSavings = totalTarget.subtract(totalSaved);
        if (remSavings.compareTo(BigDecimal.ZERO) < 0) {
            remSavings = BigDecimal.ZERO;
        }

        BigDecimal overallPct = BigDecimal.ZERO;
        if (totalTarget.compareTo(BigDecimal.ZERO) > 0) {
            overallPct = totalSaved.multiply(BigDecimal.valueOf(100)).divide(totalTarget, 2, RoundingMode.HALF_UP);
            if (overallPct.compareTo(BigDecimal.valueOf(100)) > 0) {
                overallPct = BigDecimal.valueOf(100);
            }
        }

        GoalResponse nearestGoalResp = nearestGoalEntity != null ? new GoalResponse(nearestGoalEntity) : null;

        return new GoalSummaryResponse(
                totalGoals,
                activeGoals,
                completedGoals,
                overdueGoals,
                totalTarget,
                totalSaved,
                remSavings,
                overallPct,
                nearestGoalResp,
                upcomingDeadlines
        );
    }

    private void validateGoalRequest(GoalRequest request) {
        if (request.getTargetAmount() == null || request.getTargetAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Target amount must be a positive number");
        }
        if (request.getCurrentAmount() != null && request.getCurrentAmount().compareTo(request.getTargetAmount()) > 0) {
            throw new IllegalArgumentException("Saved amount cannot exceed target amount");
        }
    }
}
