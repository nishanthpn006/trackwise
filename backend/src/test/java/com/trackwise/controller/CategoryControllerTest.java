package com.trackwise.controller;

import com.trackwise.dto.ApiResponse;
import com.trackwise.dto.CategoryRequest;
import com.trackwise.dto.CategoryResponse;
import com.trackwise.entity.Role;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import com.trackwise.service.CategoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SuppressWarnings("null")
class CategoryControllerTest {

    private CategoryService categoryService;
    private UserRepository userRepository;
    private CategoryController categoryController;
    private User testUser;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        categoryService = Mockito.mock(CategoryService.class);
        userRepository = Mockito.mock(UserRepository.class);
        categoryController = new CategoryController(categoryService, userRepository);

        testUser = new User("Test User", "test@example.com", "pass", Role.ROLE_USER);
        userDetails = Mockito.mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
    }

    @Test
    @DisplayName("Should fetch all categories")
    void testGetCategories() {
        when(categoryService.getCategories(testUser, null)).thenReturn(Collections.emptyList());

        ResponseEntity<ApiResponse<java.util.List<CategoryResponse>>> response =
                categoryController.getCategories(userDetails, null);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
    }

    @Test
    @DisplayName("Should create category successfully")
    void testCreateCategory() {
        CategoryRequest req = new CategoryRequest("Dining", TransactionType.EXPENSE, "utensils", "#FF0000");
        CategoryResponse mockRes = new CategoryResponse(UUID.randomUUID(), "Dining", TransactionType.EXPENSE, "utensils", "#FF0000", LocalDateTime.now());

        when(categoryService.createCategory(eq(req), eq(testUser))).thenReturn(mockRes);

        ResponseEntity<ApiResponse<CategoryResponse>> response = categoryController.createCategory(userDetails, req);

        assertNotNull(response);
        assertEquals(201, response.getStatusCode().value());
        assertEquals("Dining", response.getBody().getData().getName());
    }

    @Test
    @DisplayName("Should delete category")
    void testDeleteCategory() {
        UUID catId = UUID.randomUUID();

        ResponseEntity<ApiResponse<Void>> response = categoryController.deleteCategory(userDetails, catId);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        verify(categoryService).deleteCategory(catId, testUser);
    }
}
