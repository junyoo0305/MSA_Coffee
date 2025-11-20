package com.example.gatewayservice.dto;

public class ChangePasswordRequest {

    private String username;  // 사용자명을 추가
    private String oldPassword;
    private String newPassword;

    // Getter and Setter for username, oldPassword, newPassword
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
