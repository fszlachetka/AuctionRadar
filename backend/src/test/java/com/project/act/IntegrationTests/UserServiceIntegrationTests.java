package com.project.act.IntegrationTests;

import com.project.act.DTOs.UserDTO;
import com.project.act.Services.UserService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
@Sql(scripts = "classpath:test-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@Sql(statements = "DELETE FROM users", executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
public class UserServiceIntegrationTests {

    @Autowired
    private UserService userService;

    @Test
    void testAddUser() {
        UserDTO userDTO = new UserDTO();
        userDTO.setLogin("newuser");
        userDTO.setPasswd("password123");

        userService.addUser(userDTO);

        var retrievedUser = userService.getUserByLogin("newuser");
        assertThat(retrievedUser.getLogin()).isEqualTo("newuser");
    }

    @Test
    void testAddUserAlreadyExists() {
        UserDTO userDTO = new UserDTO();
        userDTO.setLogin("existinguser");
        userDTO.setPasswd("password123");

        assertThatThrownBy(() -> userService.addUser(userDTO))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("user by login: existinguser already exists");
    }

    @Test
    void testDeleteUser() {
        userService.deleteUser("existinguser");

        assertThatThrownBy(() -> userService.getUserByLogin("existinguser"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("User with login existinguser cannot be found in the database");
    }

    @Test
    void testGetUserByLogin() {
        var user = userService.getUserByLogin("existinguser");
        assertThat(user.getLogin()).isEqualTo("existinguser");
    }
}