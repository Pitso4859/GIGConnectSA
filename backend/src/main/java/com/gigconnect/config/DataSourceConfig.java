package com.gigconnect.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

/**
 * Explicit DataSource configuration to handle Render's database URL format.
 *
 * <p>Render injects DATABASE_URL using the bare postgresql:// URI scheme, e.g.:
 * <pre>postgresql://user:pass@host/db</pre>
 *
 * <p>JDBC (HikariCP, Flyway, Spring Data JPA) requires the jdbc: prefix:
 * <pre>jdbc:postgresql://user:pass@host/db</pre>
 *
 * <p>This config normalises the URL at startup so neither the developer
 * nor the deployment pipeline needs to manually transform it. It handles
 * three cases:
 * <ul>
 *   <li>Already correct: {@code jdbc:postgresql://...} — used as-is</li>
 *   <li>Render format:   {@code postgresql://...}      — jdbc: prepended</li>
 *   <li>Not set:         falls back to local default</li>
 * </ul>
 *
 * <p>application.yml datasource.url is intentionally left blank so that
 * Spring Boot's auto-configuration defers to this bean instead.
 */
@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    private static final String LOCAL_DEFAULT = "jdbc:postgresql://localhost:5432/gigconnect";

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Value("${DATABASE_USERNAME:postgres}")
    private String username;

    @Value("${DATABASE_PASSWORD:postgres}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        String jdbcUrl = toJdbcUrl(databaseUrl);
        log.info("DataSource URL (scheme only): {}", jdbcUrl.replaceAll("//.*@", "//<credentials>@"));

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(5);         // Render free tier: 25 total connections
        config.setConnectionTimeout(30_000);
        config.setIdleTimeout(600_000);
        config.setMaxLifetime(1_800_000);

        // When DATABASE_URL contains credentials (Render format), do not set
        // username/password separately — the driver reads them from the URL.
        if (!databaseUrl.isEmpty() && databaseUrl.contains("@")) {
            log.info("Using credentials embedded in DATABASE_URL");
        } else {
            config.setUsername(username);
            config.setPassword(password);
        }

        return new HikariDataSource(config);
    }

    /**
     * Normalises any PostgreSQL URL variant to the jdbc:postgresql:// form.
     *
     * <p>Render uses {@code postgresql://user:pass@host/db}.
     * JDBC requires {@code jdbc:postgresql://user:pass@host/db}.
     */
    static String toJdbcUrl(String raw) {
        if (raw == null || raw.isBlank()) {
            return LOCAL_DEFAULT;
        }

        if (raw.startsWith("jdbc:")) {
            return raw;
        }
        // Bare postgresql:// — just prepend jdbc:
        if (raw.startsWith("postgresql://")) {
            return "jdbc:" + raw;
        }
        // Unknown format — return as-is and let the driver report the error clearly
        log.warn("DATABASE_URL has an unrecognised scheme, passing through: {}", raw.split("@")[0]);
        return raw;
    }
}
