package com.trackwise;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

/**
 * Verifies that the Spring application context loads without errors.
 *
 * <p>The {@code TestPropertySource} overrides exclude DataSource
 * auto-configuration so the test runs without a live PostgreSQL instance.
 */
@SpringBootTest
@TestPropertySource(properties = {
        "spring.autoconfigure.exclude=" +
        "org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration," +
        "org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration," +
        "org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration"
})
class TrackWiseApplicationTests {

    @Test
    void contextLoads() {
        // Validates that the Spring context starts up successfully.
    }
}
