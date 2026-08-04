package com.trackwise.controller;

import com.trackwise.dto.ApiResponse;
import com.trackwise.dto.PagedResponse;
import com.trackwise.dto.TransactionRequest;
import com.trackwise.dto.TransactionResponse;
import com.trackwise.entity.Role;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SuppressWarnings("null")
class TransactionControllerTest {

    private TransactionService transactionService;
    private UserRepository userRepository;
    private TransactionController transactionController;
    private User testUser;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        transactionService = Mockito.mock(TransactionService.class);
        userRepository = Mockito.mock(UserRepository.class);
        transactionController = new TransactionController(transactionService, userRepository);

        testUser = new User("Test User", "test@example.com", "pass", Role.ROLE_USER);
        userDetails = Mockito.mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
    }

    @Test
    @DisplayName("Should fetch transactions page successfully")
    void testGetTransactions() {
        PagedResponse<TransactionResponse> mockPaged = new PagedResponse<>(
                Collections.emptyList(), 0, 10, 0, 0, true
        );
        when(transactionService.getTransactions(eq(testUser), any(), any(), any(), any(), any(), any()))
                .thenReturn(mockPaged);

        ResponseEntity<ApiResponse<PagedResponse<TransactionResponse>>> response =
                transactionController.getTransactions(userDetails, null, null, null, null, null, 0, 10, "date", "desc");

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
    }

    @Test
    @DisplayName("Should create transaction successfully")
    void testCreateTransaction() {
        TransactionRequest req = new TransactionRequest(
                "Coffee", new BigDecimal("4.50"), TransactionType.EXPENSE, null, LocalDate.now(), "Morning mocha"
        );

        TransactionResponse mockRes = new TransactionResponse(
                UUID.randomUUID(), "Coffee", new BigDecimal("4.50"), TransactionType.EXPENSE,
                "Morning mocha", LocalDate.now(), null, null
        );

        when(transactionService.createTransaction(eq(req), eq(testUser))).thenReturn(mockRes);

        ResponseEntity<ApiResponse<TransactionResponse>> response =
                transactionController.createTransaction(userDetails, req);

        assertNotNull(response);
        assertEquals(201, response.getStatusCode().value());
        assertEquals("Coffee", response.getBody().getData().getTitle());
    }

    @Test
    @DisplayName("Should delete transaction")
    void testDeleteTransaction() {
        UUID txId = UUID.randomUUID();

        ResponseEntity<ApiResponse<Void>> response = transactionController.deleteTransaction(userDetails, txId);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        verify(transactionService).deleteTransaction(txId, testUser);
    }
}
