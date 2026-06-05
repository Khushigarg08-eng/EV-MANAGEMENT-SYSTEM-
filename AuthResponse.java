package com.evmanagement.backend.dto;

import com.evmanagement.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserData user;

    @Data
    @AllArgsConstructor
    public static class UserData {
        private Long id;
        private String name;
        private String email;
        private String role;
    }
}
