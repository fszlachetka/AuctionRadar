package com.project.act.UnitTests;

import com.project.act.Controllers.UserRestController;
import com.project.act.DTOs.UserDTO;
import com.project.act.Services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserRestControllerTests {
    @InjectMocks
    UserRestController userRestController;

    @Mock
    UserService userService;

    private UserDTO userDTO;

    @BeforeEach
    public void setup(){
        userDTO = new UserDTO(
                "paweł",
                "brożek"
        );
    }

    @Test
    void testGetUser(){
        when(userService.getUserByLogin("paweł")).thenReturn(userDTO);
        ResponseEntity<Object> response = userRestController.userByLogin("paweł");
        assertEquals(HttpStatus.OK, response.getStatusCode());
        UserDTO res = (UserDTO) response.getBody();

        assertEquals(userDTO.getPasswd(), res.getPasswd());
        assertEquals(userDTO.getLogin(), res.getLogin());
    }

    @Test
    void testAddUser(){
        ResponseEntity<Object> response = userRestController.addUser(userDTO);
        verify(userService, times(1)).addUser(userDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testDelUser(){
        ResponseEntity<Object> response = userRestController.delUser(userDTO.getLogin());
        verify(userService, times(1)).deleteUser(userDTO.getLogin());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

}
