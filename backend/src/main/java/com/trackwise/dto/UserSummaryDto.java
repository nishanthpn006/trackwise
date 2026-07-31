package com.trackwise.dto;

import com.trackwise.entity.Role;
import com.trackwise.entity.User;

import java.util.UUID;

/**
 * UserSummaryDto — Safe public view of User details (omits password hash).
 */
public class UserSummaryDto {

    private UUID id;
    private String fullName;
    private String email;
    private Role role;

    public UserSummaryDto() {
    }

    public UserSummaryDto(UUID id, String fullName, String email, Role role) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }

    public static UserSummaryDto fromEntity(User user) {
        if (user == null) return null;
        return new UserSummaryDto(user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
