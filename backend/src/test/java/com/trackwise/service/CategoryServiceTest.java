package com.trackwise.service;

import com.trackwise.dto.CategoryRequest;
import com.trackwise.dto.CategoryResponse;
import com.trackwise.entity.Role;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import com.trackwise.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class CategoryServiceTest {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = userRepository.save(new User("Cat Test User", "cattest@example.com", "pass123", Role.ROLE_USER));
    }

    @Test
    void getCategories_AutoSeedsDefaultsWhenEmpty() {
        List<CategoryResponse> categories = categoryService.getCategories(testUser, null);
        assertFalse(categories.isEmpty());
        assertTrue(categories.size() >= 5);
    }

    @Test
    void createCategory_Success() {
        CategoryRequest request = new CategoryRequest("Custom Crypto", TransactionType.INCOME, "coins", "#00FF00");
        CategoryResponse response = categoryService.createCategory(request, testUser);

        assertNotNull(response);
        assertNotNull(response.getId());
        assertEquals("Custom Crypto", response.getName());
        assertEquals(TransactionType.INCOME, response.getType());
    }

    @Test
    void createCategory_DuplicateName_ThrowsException() {
        CategoryRequest request = new CategoryRequest("Unique Category", TransactionType.EXPENSE, "tag", "#FF0000");
        categoryService.createCategory(request, testUser);

        CategoryRequest duplicateRequest = new CategoryRequest("Unique Category", TransactionType.EXPENSE, "tag", "#FF0000");
        assertThrows(IllegalArgumentException.class, () -> categoryService.createCategory(duplicateRequest, testUser));
    }
}
