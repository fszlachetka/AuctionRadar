package com.project.act.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PasswordChangeDTO {
    private String login;
    private String oldPassword;
    private String newPassword;
}