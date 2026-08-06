package com.trackwise.controller;

import com.trackwise.dto.ApiResponse;
import com.trackwise.dto.ReportSummaryResponse;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

/**
 * ReportController — REST API endpoints for user reports, KPI analytics, trends, and export features.
 */
@RestController
@RequestMapping({"/api/v1/reports", "/api/reports"})
public class ReportController {

    private final ReportService reportService;
    private final UserRepository userRepository;

    public ReportController(ReportService reportService, UserRepository userRepository) {
        this.reportService = reportService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
    }

    /**
     * GET /api/reports/dashboard — Retrieves overall report summary, KPI metrics, trends, and insights.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<ReportSummaryResponse>> getReportDashboard(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category
    ) {
        User user = getAuthenticatedUser(userDetails);
        ReportSummaryResponse summary = reportService.getReportSummary(user, startDate, endDate, search, category);
        return ResponseEntity.ok(ApiResponse.success("Reports dashboard data retrieved successfully", summary));
    }

    /**
     * GET /api/reports/export — Exports financial report metrics as a formatted CSV download.
     */
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "csv") String format
    ) {
        User user = getAuthenticatedUser(userDetails);
        ReportSummaryResponse summary = reportService.getReportSummary(user, startDate, endDate, search, category);

        StringBuilder csv = new StringBuilder();
        csv.append("TrackWise Financial Report\n");
        csv.append("User,").append(user.getFullName()).append("\n");
        csv.append("Period,").append(startDate != null ? startDate : "All-time").append(" to ").append(endDate != null ? endDate : "Present").append("\n\n");

        csv.append("KPI Metric,Value\n");
        csv.append("Total Income,").append(summary.getTotalIncome()).append("\n");
        csv.append("Total Expenses,").append(summary.getTotalExpenses()).append("\n");
        csv.append("Net Savings,").append(summary.getNetSavings()).append("\n");
        csv.append("Savings Rate,").append(summary.getSavingsRatePercentage()).append("%\n");
        csv.append("Average Daily Spend,").append(summary.getAverageDailySpend()).append("\n");
        csv.append("Average Monthly Spend,").append(summary.getAverageMonthlySpend()).append("\n");
        csv.append("Largest Expense,").append(summary.getLargestExpense()).append("\n");
        csv.append("Largest Income,").append(summary.getLargestIncome()).append("\n");
        csv.append("Transactions Count,").append(summary.getTransactionsCount()).append("\n\n");

        csv.append("Category Breakdown\n");
        csv.append("Category,Amount,Percentage,Transactions\n");
        if (summary.getCategoryBreakdown() != null) {
            summary.getCategoryBreakdown().forEach(c ->
                    csv.append(c.getCategoryName()).append(",")
                            .append(c.getAmount()).append(",")
                            .append(c.getPercentage()).append("%\n")
            );
        }

        byte[] csvBytes = csv.toString().getBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=trackwise-report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvBytes);
    }
}
