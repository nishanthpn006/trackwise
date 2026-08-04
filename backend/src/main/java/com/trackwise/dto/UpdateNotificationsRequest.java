package com.trackwise.dto;

public class UpdateNotificationsRequest {
    private boolean budgetAlerts;
    private boolean goalAlerts;
    private boolean monthlySummary;
    private boolean weeklySummary;
    private boolean securityAlerts;
    private boolean emailNotifications;
    private boolean pushNotifications;

    public UpdateNotificationsRequest() {
    }

    public UpdateNotificationsRequest(boolean budgetAlerts, boolean goalAlerts, boolean monthlySummary, boolean weeklySummary, boolean securityAlerts, boolean emailNotifications, boolean pushNotifications) {
        this.budgetAlerts = budgetAlerts;
        this.goalAlerts = goalAlerts;
        this.monthlySummary = monthlySummary;
        this.weeklySummary = weeklySummary;
        this.securityAlerts = securityAlerts;
        this.emailNotifications = emailNotifications;
        this.pushNotifications = pushNotifications;
    }

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
}
