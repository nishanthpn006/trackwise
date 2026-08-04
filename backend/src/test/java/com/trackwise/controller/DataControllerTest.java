package com.trackwise.controller;

import com.trackwise.dto.ApiResponse;
import com.trackwise.dto.ImportResultResponse;
import com.trackwise.entity.Role;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.DataExportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.userdetails.UserDetails;

import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@SuppressWarnings("null")
class DataControllerTest {

    private DataExportService dataExportService;
    private UserRepository userRepository;
    private DataController dataController;
    private User testUser;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        dataExportService = Mockito.mock(DataExportService.class);
        userRepository = Mockito.mock(UserRepository.class);
        dataController = new DataController(dataExportService, userRepository);

        testUser = new User("Test User", "test@example.com", "pass", Role.ROLE_USER);
        userDetails = Mockito.mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
    }

    @Test
    @DisplayName("Should export transactions CSV successfully")
    void testExportTransactionsCsv() {
        byte[] mockCsv = "Date,Title,Type,Amount\n2026-08-01,Test,EXPENSE,10.00\n".getBytes(StandardCharsets.UTF_8);
        when(dataExportService.exportTransactionsCsv(testUser)).thenReturn(mockCsv);

        ResponseEntity<byte[]> response = dataController.exportTransactionsCsv(userDetails);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("text/csv", response.getHeaders().getContentType().toString());
    }

    @Test
    @DisplayName("Should export full backup CSV successfully")
    void testExportFullBackup() {
        byte[] mockCsv = "# TrackWise Full Data Backup\n".getBytes(StandardCharsets.UTF_8);
        when(dataExportService.exportFullBackupCsv(eq(testUser), any(), any())).thenReturn(mockCsv);

        ResponseEntity<byte[]> response = dataController.exportFullBackup(userDetails);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
    }

    @Test
    @DisplayName("Should import valid CSV file successfully")
    void testImportTransactionsCsv_Success() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "import.csv", "text/csv", "Date,Title,Type,Amount\n".getBytes(StandardCharsets.UTF_8)
        );

        ImportResultResponse mockResult = new ImportResultResponse(1, 1, 0, 0, Collections.emptyList());
        when(dataExportService.importTransactionsCsv(file, testUser)).thenReturn(mockResult);

        ResponseEntity<ApiResponse<ImportResultResponse>> response = dataController.importTransactionsCsv(userDetails, file);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        assertEquals(1, response.getBody().getData().getImportedCount());
    }

    @Test
    @DisplayName("Should reject empty CSV file import with Bad Request")
    void testImportTransactionsCsv_EmptyFile() {
        MockMultipartFile emptyFile = new MockMultipartFile("file", "", "text/csv", new byte[0]);

        ResponseEntity<ApiResponse<ImportResultResponse>> response = dataController.importTransactionsCsv(userDetails, emptyFile);

        assertNotNull(response);
        assertEquals(400, response.getStatusCode().value());
        assertFalse(response.getBody().isSuccess());
    }

    @Test
    @DisplayName("Should download CSV template successfully")
    void testDownloadCsvTemplate() {
        ResponseEntity<byte[]> response = dataController.downloadCsvTemplate();

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(new String(response.getBody()).contains("Date,Title,Type,Amount"));
    }
}
