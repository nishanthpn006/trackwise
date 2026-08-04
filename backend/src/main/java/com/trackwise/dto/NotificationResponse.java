package com.trackwise.dto;

import com.trackwise.entity.Notification;
import com.trackwise.entity.NotificationPriority;
import com.trackwise.entity.NotificationType;

import java.time.LocalDateTime;
import java.util.UUID;

public class NotificationResponse {
    private UUID id;
    private String title;
    private String message;
    private NotificationType type;
    private NotificationPriority priority;
    private boolean isRead;
    private String actionUrl;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;

    public NotificationResponse() {
    }

    public NotificationResponse(Notification notification) {
        this.id = notification.getId();
        this.title = notification.getTitle();
        this.message = notification.getMessage();
        this.type = notification.getType();
        this.priority = notification.getPriority();
        this.isRead = notification.isRead();
        this.actionUrl = notification.getActionUrl();
        this.createdAt = notification.getCreatedAt();
        this.readAt = notification.getReadAt();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }

    public NotificationPriority getPriority() { return priority; }
    public void setPriority(NotificationPriority priority) { this.priority = priority; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public String getActionUrl() { return actionUrl; }
    public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getReadAt() { return readAt; }
    public void setReadAt(LocalDateTime readAt) { this.readAt = readAt; }
}
