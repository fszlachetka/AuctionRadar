package com.project.act.Mappers;

import com.project.act.DTOs.UserDTO;
import com.project.act.DTOs.UserGetDTO;
import com.project.act.Entities.User;

public class UserMapper {
    public static User toEntity(UserDTO user){
        User UserEntity = new User();
        UserEntity.setLogin(user.getLogin());
        UserEntity.setPasswd(user.getPasswd());
        return UserEntity;
    }

    public static UserGetDTO toGetDTO(User user){
        return new UserGetDTO(user.getUserId(), user.getLogin(), user.getPasswd());
    }

    public static UserDTO toDTO(User user){
        return new UserDTO(user.getLogin(), user.getPasswd());
    }
}
