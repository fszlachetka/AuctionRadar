package com.project.act.UnitTests.UserTests;

import com.project.act.DTOs.UserDTO;
import com.project.act.Entities.User;
import com.project.act.Mappers.UserMapper;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class UserMapperTests {

    @Test
    void toEntityTest(){
        UserDTO userDTO = new UserDTO("nitro", "tofaja");
        User user = UserMapper.toEntity(userDTO);
        assertEquals("nitro", user.getLogin());
        assertEquals("tofaja", user.getPasswd());
    }

    @Test
    void toDTOTest(){
        User user = new User();
        user.setLogin("olejnikSento");
        user.setPasswd("pattaya");
        UserDTO userDTO = UserMapper.toDTO(user);
        assertEquals("olejnikSento", userDTO.getLogin());
        assertEquals("pattaya", userDTO.getPasswd());
    }

}
