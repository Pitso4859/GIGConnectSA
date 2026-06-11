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
import java.net.URI;
import java.net.URISyntaxException;

/**
 * Explicit DataSource configuration that handles Render's PostgreSQL URL format.
 *
 * <p>Render injects DATABASE_URL in standard URI form:
 * <pre>postgresql://user:pass@host/database</pre>
 *
 * <p>The PostgreSQL JDBC driver does NOT accept credentials in the URL authority
 * (user:pass@host). It requires one of:
 * <ul>
 *   <li>Separate username/password via HikariConfig.setUsername/setPassword</li>
 *   <li>Query parameters: jdbc:postgresql://host/db?user=...&amp;password=...</li>
 * </ul>
 *
 * <p>This config parses Render's URL, extracts the credentials, builds a clean
 * jdbc:postgresql://host:port/database URL, and passes credentials separately —
 * which is the form HikariCP and the pg driver both accept.
 */
@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    // Fallback credentials for local development (ignored when DATABASE_URL has credentials)
    @Value("${DATABASE_USERNAME:postgres}")
    private String fallbackUsername;

    @Value("${DATABASE_PASSWORD:postgres}")
    private String fallbackPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        ParsedUrl parsed = parseUrl(databaseUrl);
        log.info("Connecting to database: jdbc:postgresql://{}:{}/{}",
                parsed.host, parsed.port, parsed.database);

        HikariConfig config = new HikariConfig();
        // Clean JDBC URL — host, port, database only. No credentials in the URL.
        config.setJdbcUrl(
                String.format("jdbc:postgresql://%s:%d/%s", parsed.host, parsed.port, parsed.database)
        );
        config.setUsername(parsed.username);
        config.setPassword(parsed.password);
        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(5);       // Render free tier: 25 total connections shared
        config.setConnectionTimeout(30_000);
        config.setIdleTimeout(600_000);
        config.setMaxLifetime(1_800_000);

        return new HikariDataSource(config);
    }

    /**
     * Parses any PostgreSQL URL variant into its components.
     *
     * <p>Handles:
     * <ul>
     *   <li>{@code postgresql://user:pass@host:port/db}  — Render format</li>
     *   <li>{@code postgresql://user:pass@host/db}       — Render (no explicit port)</li>
     *   <li>{@code jdbc:postgresql://host:port/db}       — standard JDBC (local dev)</li>
     *   <li>Empty / not set                              — local defaults</li>
     * </ul>
     */
    ParsedUrl parseUrl(String raw) {
        // Not set — local development defaults
        if (raw == null || raw.isBlank()) {
            return new ParsedUrl("localhost", 5432, "gigconnect",
                    fallbackUsername, fallbackPassword);
        }

        // Strip jdbc: prefix so java.net.URI can parse it as a standard URI
        String uriString = raw.startsWith("jdbc:") ? raw.substring(5) : raw;

        try {
            URI uri = new URI(uriString);
            String host = uri.getHost() != null ? uri.getHost() : "localhost";
            int port = uri.getPort() > 0 ? uri.getPort() : 5432;
            // Path is "/database" — strip the leading slash
            String database = uri.getPath() != null
                    ? uri.getPath().replaceFirst("^/+", "")
                    : "gigconnect";

            // Extract user:pass from the URI user-info component
            String username = fallbackUsername;
            String password = fallbackPassword;
            String userInfo = uri.getUserInfo();
            if (userInfo != null && !userInfo.isBlank()) {
                String[] parts = userInfo.split(":", 2);
                username = parts[0];
                password = parts.length > 1 ? parts[1] : fallbackPassword;
            }

            return new ParsedUrl(host, port, database, username, password);

        } catch (URISyntaxException e) {
            log.error("Could not parse DATABASE_URL — falling back to localhost. Error: {}", e.getMessage());
            return new ParsedUrl("localhost", 5432, "gigconnect",
                    fallbackUsername, fallbackPassword);
        }
    }

    record ParsedUrl(String host, int port, String database, String username, String password) {}
}
