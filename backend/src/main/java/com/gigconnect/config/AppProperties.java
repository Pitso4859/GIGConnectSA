package com.gigconnect.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "app")
@Data
public class AppProperties {
    private Jwt jwt = new Jwt();
    private Cors cors = new Cors();
    private Gemini gemini = new Gemini();

    @Data public static class Jwt {
        private String secret;
        private long accessTokenExpiration;
        private long refreshTokenExpiration;
    }

    @Data public static class Cors {
        // Spring Boot will bind a YAML list OR a comma-separated string from
        // the CORS_ORIGINS env var to this List<String> field automatically.
        // Do NOT set CORS_ORIGINS to an empty string — use the defaults in
        // application.yml instead, or set it to actual frontend URL(s).
        private List<String> allowedOrigins;
    }

    @Data public static class Gemini {
        private String apiKey;
        private String model;
        private String baseUrl;
    }
}
