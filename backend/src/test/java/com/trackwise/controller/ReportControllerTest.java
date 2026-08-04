package com.trackwise.controller;

import com.trackwise.dto.ApiResponse;
import com.trackwise.dto.ReportSummaryResponse;
import com.trackwise.entity.Role;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.ReportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SuppressWarnings("null")
class ReportControllerTest {

    private ReportService reportService;
    private UserRepository userRepository;
    private ReportController reportController;
    private User testUser;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        reportService = Mockito.mock(ReportService.class);
        userRepository = Mockito.mock(UserRepository.class);
        reportController = new ReportController(reportService, userRepository);

        testUser = new User("Test User", "test@example.com", "pass", Role.ROLE_USER);
        userDetails = Mockito.mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
    }

    @Test
    @DisplayName("Should fetch report dashboard analytics")
    void testGetReportDashboard() {
        ReportSummaryResponse mockSummary = new ReportSummaryResponse();
        mockSummary.setTotalIncome(new BigDecimal("5000.00"));
        mockSummary.setTotalExpenses(new BigDecimal("2000.00"));
        mockSummary.setSavingsRatePercentage(new BigDecimal("60.00"));

        when(reportService.getReportSummary(testUser, null, null, null, null)).thenReturn(mockSummary);

        ResponseEntity<ApiResponse<ReportSummaryResponse>> response =
                reportController.getReportDashboard(userDetails, null, null, null, null);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        assertEquals(new BigDecimal("60.00"), response.getBody().getData().getSavingsRatePercentage());
    }

    @Test
    @DisplayName("Should export report CSV successfully")
    void testExportReport() {
        ReportSummaryResponse mockSummary = new ReportSummaryResponse();
        mockSummary.setTotalIncome(BigDecimal.TEN);

        when(reportService.getReportSummary(testUser, null, null, null, null)).thenReturn(mockSummary);

        ResponseEntity<byte[]> response = reportController.exportReport(userDetails, null, null, null, null, "csv");

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(new String(response.getBody()).contains("TrackWise Financial Report"));
    }
}
