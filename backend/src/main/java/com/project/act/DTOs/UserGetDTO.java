package com.project.act.DTOs;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserGetDTO {
    private Long id;
    private String login;
    private String Passwd;
}
