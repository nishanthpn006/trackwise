package com.trackwise.service;

import com.trackwise.dto.DeleteAccountRequest;
import com.trackwise.dto.UpdateAvatarRequest;
import com.trackwise.dto.UpdateNotificationsRequest;
import com.trackwise.dto.UpdatePasswordRequest;
import com.trackwise.dto.UpdatePreferencesRequest;
import com.trackwise.dto.UpdateProfileRequest;
import com.trackwise.dto.UserProfileResponse;
import com.trackwise.dto.UserStatisticsResponse;
import com.trackwise.entity.User;
import com.trackwise.repository.BudgetRepository;
import com.trackwise.repository.CategoryRepository;
import com.trackwise.repository.GoalRepository;
import com.trackwise.repository.TransactionRepository;
import com.trackwise.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
@SuppressWarnings("null")
public class UserService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final BudgetRepository budgetRepository;
    private final GoalRepository goalRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       TransactionRepository transactionRepository,
                       CategoryRepository categoryRepository,
                       BudgetRepository budgetRepository,
                       GoalRepository goalRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.budgetRepository = budgetRepository;
        this.goalRepository = goalRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(User user) {
        User existing = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("User not found"));
        return new UserProfileResponse(existing);
    }

    public UserProfileResponse updateProfile(User user, UpdateProfileRequest request) {
        User existing = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        existing.setFullName(request.getFullName().trim());
        if (request.getPhone() != null) existing.setPhone(request.getPhone().trim());
        if (request.getCurrency() != null) existing.setCurrency(request.getCurrency().trim());
        if (request.getTimezone() != null) existing.setTimezone(request.getTimezone().trim());
        if (request.getBio() != null) existing.setBio(request.getBio().trim());

        User updated = userRepository.save(existing);
        return new UserProfileResponse(updated);
    }

    public void updatePassword(User user, UpdatePasswordRequest request) {
        User existing = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), existing.getPassword())) {
            throw new IllegalArgumentException("Current password provided is incorrect");
        }

        existing.setPassword(passwordEncoder.encode(request.getNewPassword()));
        existing.setPasswordChangedAt(LocalDateTime.now());
        userRepository.save(existing);
    }

    public UserProfileResponse updatePreferences(User user, UpdatePreferencesRequest request) {
        User existing = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (request.getCurrency() != null) existing.setCurrency(request.getCurrency());
        if (request.getDateFormat() != null) existing.setDateFormat(request.getDateFormat());
        if (request.getTimeFormat() != null) existing.setTimeFormat(request.getTimeFormat());
        if (request.getFirstDayOfWeek() != null) existing.setFirstDayOfWeek(request.getFirstDayOfWeek());
        if (request.getNumberFormat() != null) existing.setNumberFormat(request.getNumberFormat());
        if (request.getLanguage() != null) existing.setLanguage(request.getLanguage());
        if (request.getTheme() != null) existing.setTheme(request.getTheme());

        User updated = userRepository.save(existing);
        return new UserProfileResponse(updated);
    }

    public UserProfileResponse updateNotifications(User user, UpdateNotificationsRequest request) {
        User existing = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        existing.setBudgetAlerts(request.isBudgetAlerts());
        existing.setGoalAlerts(request.isGoalAlerts());
        existing.setMonthlySummary(request.isMonthlySummary());
        existing.setWeeklySummary(request.isWeeklySummary());
        existing.setSecurityAlerts(request.isSecurityAlerts());
        existing.setEmailNotifications(request.isEmailNotifications());
        existing.setPushNotifications(request.isPushNotifications());

        User updated = userRepository.save(existing);
        return new UserProfileResponse(updated);
    }

    public UserProfileResponse updateAvatar(User user, UpdateAvatarRequest request) {
        User existing = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        existing.setAvatarUrl(request.getAvatarUrl());
        User updated = userRepository.save(existing);
        return new UserProfileResponse(updated);
    }

    public UserProfileResponse deleteAvatar(User user) {
        User existing = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        existing.setAvatarUrl(null);
        User updated = userRepository.save(existing);
        return new UserProfileResponse(updated);
    }

    @Transactional(readOnly = true)
    public UserStatisticsResponse getStatistics(User user) {
        long txCount = transactionRepository.countByUser(user);
        long catCount = categoryRepository.findByUser(user).size();
        long budgetCount = budgetRepository.findAllByUserOrderByCreatedAtDesc(user).size();
        long goalCount = goalRepository.findByUserOrderByTargetDateAsc(user).size();

        return new UserStatisticsResponse(txCount, catCount, budgetCount, goalCount, 12, user.getCreatedAt());
    }

    @SuppressWarnings("null")
    public void deleteAccount(User user, DeleteAccountRequest request) {
        User existing = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), existing.getPassword())) {
            throw new IllegalArgumentException("Incorrect password provided for account deletion");
        }

        // Delete user's cascading data
        transactionRepository.deleteAll(transactionRepository.findByUserAndDateBetween(existing, LocalDateTime.now().minusYears(100).toLocalDate(), LocalDateTime.now().plusYears(100).toLocalDate()));
        goalRepository.deleteAll(goalRepository.findByUserOrderByTargetDateAsc(existing));
        budgetRepository.deleteAll(budgetRepository.findAllByUserOrderByCreatedAtDesc(existing));
        categoryRepository.deleteAll(categoryRepository.findByUser(existing));
        userRepository.delete(existing);
    }
}
