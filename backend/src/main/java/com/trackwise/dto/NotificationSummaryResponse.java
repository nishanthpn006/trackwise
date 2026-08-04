package com.trackwise.dto;

import java.util.List;

public class NotificationSummaryResponse {
    private long totalCount;
    private long unreadCount;
    private List<NotificationResponse> notifications;

    public NotificationSummaryResponse() {
    }

    public NotificationSummaryResponse(long totalCount, long unreadCount, List<NotificationResponse> notifications) {
        this.totalCount = totalCount;
        this.unreadCount = unreadCount;
        this.notifications = notifications;
    }

    public long getTotalCount() { return totalCount; }
    public void setTotalCount(long totalCount) { this.totalCount = totalCount; }

    public long getUnreadCount() { return unreadCount; }
    public void setUnreadCount(long unreadCount) { this.unreadCount = unreadCount; }

    public List<NotificationResponse> getNotifications() { return notifications; }
    public void setNotifications(List<NotificationResponse> notifications) { this.notifications = notifications; }
}
