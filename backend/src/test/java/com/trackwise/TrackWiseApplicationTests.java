package com.trackwise;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Smoke test — verifies the Spring application context loads without errors.
 *
 * <p>The {@code test} profile (src/test/resources/application-test.properties)
 * excludes DataSource/JPA auto-configuration so this test runs without a live
 * PostgreSQL instance.
 */
@SpringBootTest
@ActiveProfiles("test")
class TrackWiseApplicationTests {

    @Test
    void contextLoads() {
        // Validates that the Spring context assembles successfully.
    }
}
