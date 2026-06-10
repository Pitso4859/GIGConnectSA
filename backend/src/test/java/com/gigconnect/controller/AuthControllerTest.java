package com.gigconnect.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gigconnect.dto.request.LoginRequest;
import com.gigconnect.dto.request.RegisterRequest;
import com.gigconnect.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthControllerTest {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;

    @Test
    void register_and_login_success() throws Exception {
        var reg = new RegisterRequest();
        reg.setFullName("Test User");
        reg.setEmail("test@gigconnect.co.za");
        reg.setPassword("password123");
        reg.setRole(User.Role.WORKER);

        mvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(reg)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty());
    }

    @Test
    void login_wrong_credentials_returns_401() throws Exception {
        var login = new LoginRequest();
        login.setEmail("nobody@example.com");
        login.setPassword("wrongpassword");

        mvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized());
    }
}
