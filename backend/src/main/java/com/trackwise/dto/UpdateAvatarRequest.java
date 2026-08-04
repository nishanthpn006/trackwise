package com.trackwise.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateAvatarRequest {

    @NotBlank(message = "Avatar URL or image payload is required")
    private String avatarUrl;

    public UpdateAvatarRequest() {
    }

    public UpdateAvatarRequest(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}
