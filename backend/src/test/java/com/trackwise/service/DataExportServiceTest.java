package com.trackwise.service;

import com.trackwise.dto.ImportResultResponse;
import com.trackwise.entity.Category;
import com.trackwise.entity.Transaction;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import com.trackwise.repository.CategoryRepository;
import com.trackwise.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class DataExportServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private DataExportService dataExportService;

    @Captor
    private ArgumentCaptor<List<Transaction>> transactionListCaptor;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setFullName("Jane Doe");
        testUser.setEmail("jane@example.com");
    }

    @Test
    @DisplayName("Should export user transactions cleanly to CSV byte array")
    void testExportTransactionsCsv() {
        Category cat = new Category();
        cat.setName("Groceries");

        Transaction tx = new Transaction();
        tx.setTitle("Market Purchase");
        tx.setAmount(new BigDecimal("75.50"));
        tx.setType(TransactionType.EXPENSE);
        tx.setDate(LocalDate.of(2026, 8, 1));
        tx.setCategory(cat);
        tx.setDescription("Fresh produce");

        when(transactionRepository.findByUserOrderByDateDesc(testUser)).thenReturn(List.of(tx));

        byte[] result = dataExportService.exportTransactionsCsv(testUser);
        assertNotNull(result);
        String csvContent = new String(result, StandardCharsets.UTF_8);

        assertTrue(csvContent.contains("Date,Title,Type,Amount,Category,Description"));
        assertTrue(csvContent.contains("2026-08-01,Market Purchase,EXPENSE,75.50,Groceries,Fresh produce"));
    }

    @Test
    @DisplayName("Should import transactions from valid CSV file")
    void testImportTransactionsCsv_Success() throws Exception {
        String csvData = "Date,Title,Type,Amount,Category,Description\n" +
                "2026-08-01,Salary,INCOME,3500.00,Work,Monthly pay\n" +
                "2026-08-02,Supermarket,EXPENSE,120.00,Groceries,Weekly food\n";

        MockMultipartFile file = new MockMultipartFile(
                "file", "import.csv", "text/csv", csvData.getBytes(StandardCharsets.UTF_8)
        );

        when(categoryRepository.findByUser(testUser)).thenReturn(Collections.emptyList());

        ImportResultResponse result = dataExportService.importTransactionsCsv(file, testUser);

        assertNotNull(result);
        assertEquals(2, result.getImportedCount());
        assertEquals(0, result.getErrorCount());
        verify(transactionRepository, times(1)).saveAll(transactionListCaptor.capture());

        List<Transaction> saved = transactionListCaptor.getValue();
        assertEquals(2, saved.size());
        assertEquals("Salary", saved.get(0).getTitle());
        assertEquals(TransactionType.INCOME, saved.get(0).getType());
    }

    @Test
    @DisplayName("Should skip invalid date or amount rows gracefully during import")
    void testImportTransactionsCsv_WithInvalidRows() throws Exception {
        String csvData = "Date,Title,Type,Amount,Category,Description\n" +
                "invalid-date,Bad Date,EXPENSE,50.00,Groceries,Test\n" +
                "2026-08-01,Valid Row,EXPENSE,100.00,Groceries,Good row\n";

        MockMultipartFile file = new MockMultipartFile(
                "file", "import.csv", "text/csv", csvData.getBytes(StandardCharsets.UTF_8)
        );

        when(categoryRepository.findByUser(testUser)).thenReturn(Collections.emptyList());

        ImportResultResponse result = dataExportService.importTransactionsCsv(file, testUser);

        assertNotNull(result);
        assertEquals(1, result.getImportedCount());
        assertEquals(1, result.getErrorCount());
        assertFalse(result.getErrors().isEmpty());
    }
}
