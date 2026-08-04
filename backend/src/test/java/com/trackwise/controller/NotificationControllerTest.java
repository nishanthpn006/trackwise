package com.trackwise.controller;

import com.trackwise.dto.ApiResponse;
import com.trackwise.dto.NotificationResponse;
import com.trackwise.dto.NotificationSummaryResponse;
import com.trackwise.entity.Role;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SuppressWarnings("null")
class NotificationControllerTest {

    private NotificationService notificationService;
    private UserRepository userRepository;
    private NotificationController notificationController;
    private User testUser;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        notificationService = Mockito.mock(NotificationService.class);
        userRepository = Mockito.mock(UserRepository.class);
        notificationController = new NotificationController(notificationService, userRepository);

        testUser = new User("Test User", "test@example.com", "pass", Role.ROLE_USER);
        userDetails = Mockito.mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
    }

    @Test
    @DisplayName("Should fetch notifications list successfully")
    void testGetNotifications() {
        when(notificationService.getUserNotifications(testUser, false, null, null))
                .thenReturn(Collections.emptyList());

        ResponseEntity<ApiResponse<List<NotificationResponse>>> response =
                notificationController.getNotifications(userDetails, false, null, null);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
    }

    @Test
    @DisplayName("Should fetch unread notifications count successfully")
    void testGetUnreadCount() {
        when(notificationService.getUnreadCount(testUser)).thenReturn(3L);

        ResponseEntity<ApiResponse<Long>> response = notificationController.getUnreadCount(userDetails);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(3L, response.getBody().getData());
    }

    @Test
    @DisplayName("Should fetch notification summary successfully")
    void testGetSummary() {
        NotificationSummaryResponse summary = new NotificationSummaryResponse(5, 2, Collections.emptyList());
        when(notificationService.getSummary(testUser)).thenReturn(summary);

        ResponseEntity<ApiResponse<NotificationSummaryResponse>> response = notificationController.getSummary(userDetails);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(5, response.getBody().getData().getTotalCount());
    }

    @Test
    @DisplayName("Should mark notification as read")
    void testMarkAsRead() {
        UUID notifId = UUID.randomUUID();

        ResponseEntity<ApiResponse<NotificationResponse>> response =
                notificationController.markAsRead(userDetails, notifId);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        verify(notificationService).markAsRead(testUser, notifId);
    }

    @Test
    @DisplayName("Should mark all notifications as read")
    void testMarkAllAsRead() {
        ResponseEntity<ApiResponse<Void>> response = notificationController.markAllAsRead(userDetails);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        verify(notificationService).markAllAsRead(testUser);
    }

    @Test
    @DisplayName("Should delete notification")
    void testDeleteNotification() {
        UUID notifId = UUID.randomUUID();

        ResponseEntity<ApiResponse<Void>> response = notificationController.deleteNotification(userDetails, notifId);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        verify(notificationService).deleteNotification(testUser, notifId);
    }
}
