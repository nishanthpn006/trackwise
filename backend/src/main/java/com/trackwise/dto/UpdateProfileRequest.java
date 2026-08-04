package com.trackwise.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    private String phone;
    private String currency;
    private String timezone;
    private String bio;

    public UpdateProfileRequest() {
    }

    public UpdateProfileRequest(String fullName, String phone, String currency, String timezone, String bio) {
        this.fullName = fullName;
        this.phone = phone;
        this.currency = currency;
        this.timezone = timezone;
        this.bio = bio;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}
