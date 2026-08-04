package com.trackwise.service;

import com.trackwise.dto.NotificationResponse;
import com.trackwise.entity.NotificationPriority;
import com.trackwise.entity.NotificationType;
import com.trackwise.entity.Role;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@SuppressWarnings("null")
class NotificationServiceTest {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = userRepository.save(new User("Notify User", "notifytest@example.com", passwordEncoder.encode("password123"), Role.ROLE_USER));
    }

    @Test
    void createNotification_StoresAndRetrievesNotification() {
        NotificationResponse res = notificationService.createNotification(
                testUser, "Test Alert", "This is a test notification",
                NotificationType.SYSTEM_NOTIFICATION, NotificationPriority.MEDIUM, "/dashboard"
        );

        assertNotNull(res.getId());
        assertEquals("Test Alert", res.getTitle());

        List<NotificationResponse> list = notificationService.getUserNotifications(testUser, false, null, null);
        assertFalse(list.isEmpty());
        assertEquals(1, notificationService.getUnreadCount(testUser));
    }

    @Test
    void markAsRead_UpdatesIsReadStatus() {
        NotificationResponse created = notificationService.createNotification(
                testUser, "Unread Alert", "Will be marked read",
                NotificationType.BUDGET_ALERT, NotificationPriority.HIGH, "/budgets"
        );

        NotificationResponse updated = notificationService.markAsRead(testUser, created.getId());
        assertTrue(updated.isRead());
        assertEquals(0, notificationService.getUnreadCount(testUser));
    }

    @Test
    void markAllAsRead_MarksAllUserNotificationsRead() {
        notificationService.createNotification(testUser, "Alert 1", "Message 1", NotificationType.BUDGET_ALERT, NotificationPriority.MEDIUM, null);
        notificationService.createNotification(testUser, "Alert 2", "Message 2", NotificationType.GOAL_MILESTONE, NotificationPriority.HIGH, null);

        assertEquals(2, notificationService.getUnreadCount(testUser));

        notificationService.markAllAsRead(testUser);
        assertEquals(0, notificationService.getUnreadCount(testUser));
    }

    @Test
    void clearAllNotifications_DeletesAllUserNotifications() {
        notificationService.createNotification(testUser, "Alert 1", "Message 1", NotificationType.BUDGET_ALERT, NotificationPriority.MEDIUM, null);
        notificationService.createNotification(testUser, "Alert 2", "Message 2", NotificationType.GOAL_MILESTONE, NotificationPriority.HIGH, null);

        notificationService.clearAllNotifications(testUser);
        List<NotificationResponse> list = notificationService.getUserNotifications(testUser, false, null, null);
        assertTrue(list.isEmpty());
    }
}
