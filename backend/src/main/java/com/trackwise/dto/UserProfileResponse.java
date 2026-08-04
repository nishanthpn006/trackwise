package com.trackwise.dto;

import com.trackwise.entity.User;
import java.time.LocalDateTime;

public class UserProfileResponse {

    private String id;
    private String fullName;
    private String email;
    private String role;
    private String phone;
    private String currency;
    private String timezone;
    private String bio;
    private String avatarUrl;

    private LocalDateTime lastLoginAt;
    private LocalDateTime passwordChangedAt;

    private String dateFormat;
    private String timeFormat;
    private String firstDayOfWeek;
    private String numberFormat;
    private String language;
    private String theme;

    private boolean budgetAlerts;
    private boolean goalAlerts;
    private boolean monthlySummary;
    private boolean weeklySummary;
    private boolean securityAlerts;
    private boolean emailNotifications;
    private boolean pushNotifications;

    private LocalDateTime createdAt;

    public UserProfileResponse() {
    }

    public UserProfileResponse(User user) {
        if (user != null) {
            this.id = user.getId() != null ? user.getId().toString() : null;
            this.fullName = user.getFullName();
            this.email = user.getEmail();
            this.role = user.getRole() != null ? user.getRole().name() : "ROLE_USER";
            this.phone = user.getPhone();
            this.currency = user.getCurrency();
            this.timezone = user.getTimezone();
            this.bio = user.getBio();
            this.avatarUrl = user.getAvatarUrl();
            this.lastLoginAt = user.getLastLoginAt();
            this.passwordChangedAt = user.getPasswordChangedAt();
            this.dateFormat = user.getDateFormat();
            this.timeFormat = user.getTimeFormat();
            this.firstDayOfWeek = user.getFirstDayOfWeek();
            this.numberFormat = user.getNumberFormat();
            this.language = user.getLanguage();
            this.theme = user.getTheme();
            this.budgetAlerts = user.isBudgetAlerts();
            this.goalAlerts = user.isGoalAlerts();
            this.monthlySummary = user.isMonthlySummary();
            this.weeklySummary = user.isWeeklySummary();
            this.securityAlerts = user.isSecurityAlerts();
            this.emailNotifications = user.isEmailNotifications();
            this.pushNotifications = user.isPushNotifications();
            this.createdAt = user.getCreatedAt();
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }

    public LocalDateTime getPasswordChangedAt() { return passwordChangedAt; }
    public void setPasswordChangedAt(LocalDateTime passwordChangedAt) { this.passwordChangedAt = passwordChangedAt; }

    public String getDateFormat() { return dateFormat; }
    public void setDateFormat(String dateFormat) { this.dateFormat = dateFormat; }

    public String getTimeFormat() { return timeFormat; }
    public void setTimeFormat(String timeFormat) { this.timeFormat = timeFormat; }

    public String getFirstDayOfWeek() { return firstDayOfWeek; }
    public void setFirstDayOfWeek(String firstDayOfWeek) { this.firstDayOfWeek = firstDayOfWeek; }

    public String getNumberFormat() { return numberFormat; }
    public void setNumberFormat(String numberFormat) { this.numberFormat = numberFormat; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public boolean isBudgetAlerts() { return budgetAlerts; }
    public void setBudgetAlerts(boolean budgetAlerts) { this.budgetAlerts = budgetAlerts; }

    public boolean isGoalAlerts() { return goalAlerts; }
    public void setGoalAlerts(boolean goalAlerts) { this.goalAlerts = goalAlerts; }

    public boolean isMonthlySummary() { return monthlySummary; }
    public void setMonthlySummary(boolean monthlySummary) { this.monthlySummary = monthlySummary; }

    public boolean isWeeklySummary() { return weeklySummary; }
    public void setWeeklySummary(boolean weeklySummary) { this.weeklySummary = weeklySummary; }

    public boolean isSecurityAlerts() { return securityAlerts; }
    public void setSecurityAlerts(boolean securityAlerts) { this.securityAlerts = securityAlerts; }

    public boolean isEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(boolean emailNotifications) { this.emailNotifications = emailNotifications; }

    public boolean isPushNotifications() { return pushNotifications; }
    public void setPushNotifications(boolean pushNotifications) { this.pushNotifications = pushNotifications; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
