package com.evmanagement.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @PostMapping("/chat")
    public ResponseEntity<?> chatWithGemini(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        String context = request.getOrDefault("context", "You are VoltAI, an EV fleet manager assistant.");

        String geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + geminiApiKey;
        
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Build Gemini Request JSON manually for simplicity
        String prompt = context + "\n\nUser: " + userMessage;
        String requestBody = "{\"contents\":[{\"parts\":[{\"text\":\"" + prompt.replace("\"", "\\\"") + "\"}]}]}";

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(geminiUrl, entity, String.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"Gemini API failed: " + e.getMessage() + "\"}");
        }
    }
}
