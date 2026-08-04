package com.trackwise.service;

import com.trackwise.dto.UpdatePasswordRequest;

import com.trackwise.dto.UpdateProfileRequest;
import com.trackwise.dto.UserProfileResponse;
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

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@SuppressWarnings("null")
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = userRepository.save(new User("Settings Test User", "settingstest@example.com", passwordEncoder.encode("oldPassword123"), Role.ROLE_USER));
    }

    @Test
    void getProfile_ReturnsUserProfile() {
        UserProfileResponse profile = userService.getProfile(testUser);
        assertNotNull(profile);
        assertEquals("Settings Test User", profile.getFullName());
        assertEquals("settingstest@example.com", profile.getEmail());
    }

    @Test
    void updateProfile_UpdatesFullNameAndPreferences() {
        UpdateProfileRequest req = new UpdateProfileRequest("Updated Name", "+1234567890", "EUR", "Europe/London", "Software engineer");
        UserProfileResponse updated = userService.updateProfile(testUser, req);

        assertEquals("Updated Name", updated.getFullName());
        assertEquals("+1234567890", updated.getPhone());
        assertEquals("EUR", updated.getCurrency());
    }

    @Test
    void updatePassword_SuccessfullyChangesPassword() {
        UpdatePasswordRequest req = new UpdatePasswordRequest("oldPassword123", "newPassword456");
        userService.updatePassword(testUser, req);

        User reloaded = userRepository.findById(testUser.getId()).orElseThrow();
        assertTrue(passwordEncoder.matches("newPassword456", reloaded.getPassword()));
    }
}
