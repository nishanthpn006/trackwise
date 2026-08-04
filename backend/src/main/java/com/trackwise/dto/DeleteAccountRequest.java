package com.trackwise.dto;

import jakarta.validation.constraints.NotBlank;

public class DeleteAccountRequest {

    @NotBlank(message = "Password is required for account deletion")
    private String password;

    public DeleteAccountRequest() {
    }

    public DeleteAccountRequest(String password) {
        this.password = password;
    }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
