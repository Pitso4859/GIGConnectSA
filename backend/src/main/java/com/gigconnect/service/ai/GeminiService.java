package com.gigconnect.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gigconnect.dto.request.AiChatRequest;
import com.gigconnect.dto.response.AiChatResponse;
import com.gigconnect.entity.AiChat;
import com.gigconnect.entity.User;
import com.gigconnect.exception.ResourceNotFoundException;
import com.gigconnect.repository.AiChatRepository;
import com.gigconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiService {

    private final AiChatRepository aiChatRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Value("${app.gemini.api-key}")
    private String apiKey;

    @Value("${app.gemini.model}")
    private String model;

    @Value("${app.gemini.base-url}")
    private String baseUrl;

    private static final String SYSTEM_PROMPT = """
        You are GigAssist, an AI career and marketplace assistant for GIGConnect SA —
        a platform connecting informal workers with clients across South Africa.

        Your role:
        - Help workers improve their profiles, find jobs, set competitive rates, and build skills
        - Help clients write clear job descriptions and find the right workers
        - Provide advice on local labour regulations (BCEA, CCMA), safety, and fair pay
        - Support both English and South African vernacular (isiZulu, Afrikaans greetings etc.)
        - Always be encouraging, practical, and culturally aware of SA's informal economy

        Keep responses concise, friendly, and actionable. Format with short paragraphs.
        Never provide legal advice — direct users to the CCMA or labour dept for specific legal matters.
        """;

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .build();

    @Transactional
    public AiChatResponse chat(UUID userId, AiChatRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId.toString()));

        AiChat userMsg = AiChat.builder()
                .user(user)
                .role(AiChat.MessageRole.USER)
                .content(request.message())
                .build();
        aiChatRepository.save(userMsg);

        List<AiChat> history = aiChatRepository.findRecentByUser(user);
        String aiReply = callGemini(history, request.message(), user);

        AiChat aiMsg = AiChat.builder()
                .user(user)
                .role(AiChat.MessageRole.ASSISTANT)
                .content(aiReply)
                .build();
        aiChatRepository.save(aiMsg);

        return AiChatResponse.builder()
                .role("ASSISTANT")
                .content(aiReply)
                .createdAt(Instant.now())
                .build();
    }

    public List<AiChatResponse> getChatHistory(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId.toString()));

        return aiChatRepository.findByUserOrderByCreatedAtAsc(user).stream()
                .map(c -> AiChatResponse.builder()
                        .role(c.getRole().name())
                        .content(c.getContent())
                        .createdAt(c.getCreatedAt())
                        .build())
                .toList();
    }

    @Transactional
    public void clearHistory(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId.toString()));
        aiChatRepository.deleteAll(aiChatRepository.findByUserOrderByCreatedAtAsc(user));
    }

    private String callGemini(List<AiChat> history, String newMessage, User user) {
        try {
            var contents = new java.util.ArrayList<>();

            contents.add(java.util.Map.of(
                    "role", "user",
                    "parts", List.of(java.util.Map.of("text", SYSTEM_PROMPT +
                            "\n\nUser context: Name=" + user.getFullName() +
                            ", Role=" + user.getRole() + ", Location=" + user.getLocation()))
            ));
            contents.add(java.util.Map.of(
                    "role", "model",
                    "parts", List.of(java.util.Map.of("text",
                            "Understood! I'm GigAssist. How can I help you today?"))
            ));

            history.stream().limit(18).forEach(c -> contents.add(java.util.Map.of(
                    "role", c.getRole() == AiChat.MessageRole.USER ? "user" : "model",
                    "parts", List.of(java.util.Map.of("text", c.getContent()))
            )));

            contents.add(java.util.Map.of(
                    "role", "user",
                    "parts", List.of(java.util.Map.of("text", newMessage))
            ));

            var requestBody = java.util.Map.of(
                    "contents", contents,
                    "generationConfig", java.util.Map.of(
                            "temperature", 0.7,
                            "topK", 40,
                            "topP", 0.95,
                            "maxOutputTokens", 1024
                    )
            );

            String json = objectMapper.writeValueAsString(requestBody);
            String url = baseUrl + "/" + model + ":generateContent?key=" + apiKey;

            Request httpRequest = new Request.Builder()
                    .url(url)
                    .post(RequestBody.create(json, MediaType.parse("application/json")))
                    .build();

            try (Response response = httpClient.newCall(httpRequest).execute()) {
                if (!response.isSuccessful() || response.body() == null) {
                    log.error("Gemini API error: {}", response.code());
                    return "I'm sorry, I'm having trouble connecting right now. Please try again.";
                }

                JsonNode root = objectMapper.readTree(response.body().string());
                return root.path("candidates").get(0)
                        .path("content").path("parts").get(0)
                        .path("text").asText("I couldn't generate a response. Please try again.");
            }

        } catch (IOException e) {
            log.error("Gemini API call failed: {}", e.getMessage());
            return "I'm currently unavailable. Please try again later.";
        }
    }
}