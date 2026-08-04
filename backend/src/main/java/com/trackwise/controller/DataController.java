package com.trackwise.controller;

import com.trackwise.dto.ApiResponse;
import com.trackwise.dto.ImportResultResponse;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.DataExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

/**
 * DataController — REST API controller for Data Import, Export, and Backup capabilities.
 */
@RestController
@RequestMapping("/api/data")
public class DataController {

    private final DataExportService dataExportService;
    private final UserRepository userRepository;

    public DataController(DataExportService dataExportService, UserRepository userRepository) {
        this.dataExportService = dataExportService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
    }

    /**
     * GET /api/data/export/transactions — Export transactions CSV
     */
    @GetMapping("/export/transactions")
    public ResponseEntity<byte[]> exportTransactionsCsv(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getAuthenticatedUser(userDetails);
        byte[] csvBytes = dataExportService.exportTransactionsCsv(user);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=trackwise-transactions.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvBytes);
    }

    /**
     * GET /api/data/export/backup — Full financial data backup CSV
     */
    @GetMapping("/export/backup")
    public ResponseEntity<byte[]> exportFullBackup(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getAuthenticatedUser(userDetails);
        byte[] csvBytes = dataExportService.exportFullBackupCsv(user, Collections.emptyList(), Collections.emptyList());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=trackwise-full-backup.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvBytes);
    }

    /**
     * POST /api/data/import/transactions — Upload CSV file to import transactions
     */
    @PostMapping(value = "/import/transactions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ImportResultResponse>> importTransactionsCsv(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file
    ) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Please select a valid CSV file to import."));
        }

        User user = getAuthenticatedUser(userDetails);
        try {
            ImportResultResponse result = dataExportService.importTransactionsCsv(file, user);
            return ResponseEntity.ok(ApiResponse.success("CSV import processed successfully", result));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to read uploaded CSV file: " + e.getMessage()));
        }
    }

    /**
     * GET /api/data/template — Get CSV import sample template
     */
    @GetMapping("/template")
    public ResponseEntity<byte[]> downloadCsvTemplate() {
        String template = "Date,Title,Type,Amount,Category,Description\n" +
                "2026-08-01,Grocery Shopping,EXPENSE,125.50,Groceries,Weekly supermarket run\n" +
                "2026-08-02,Software Engineer Salary,INCOME,4500.00,Salary,Monthly tech paycheck\n" +
                "2026-08-03,Coffee & Pastry,EXPENSE,8.75,Food & Dining,Morning espresso\n";

        byte[] templateBytes = template.getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=trackwise-import-template.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(templateBytes);
    }
}
