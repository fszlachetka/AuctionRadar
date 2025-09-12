package com.project.act.UnitTests.AuthTests;

import com.project.act.Controllers.AuthController;
import com.project.act.DTOs.UserDTO;
import com.project.act.Entities.User;
import com.project.act.Exceptions.UserNotFoundException;
import com.project.act.Services.UserService;
import com.project.act.Utils.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AuthControllerTests {

    private UserService userService;
    private PasswordEncoder passwordEncoder;
    private JwtUtil jwtUtil;
    private AuthController authController;

    @BeforeEach
    void setUp() {
        userService = mock(UserService.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtUtil = mock(JwtUtil.class);
        authController = new AuthController(userService, jwtUtil,  passwordEncoder);
    }

    @Test
    void testReturnTokensWhenLoginIsCorrect() {
        UserDTO dto = new UserDTO("john", "secret");

        User user = new User();
        user.setLogin("john");
        user.setPasswd("encoded");

        when(userService.getUserByLogin("john")).thenReturn(new UserDTO("john", "encoded"));
        when(passwordEncoder.matches("secret", "encoded")).thenReturn(true);
        when(jwtUtil.generateAccessToken("john")).thenReturn("access");
        when(jwtUtil.generateRefreshToken("john")).thenReturn("refresh");

        // when
        ResponseEntity<Object> response = authController.login(dto);

        // then
        assertEquals(200, response.getStatusCodeValue());
        var body = (java.util.Map<?,?>) response.getBody();
        assertEquals("access", body.get("accessToken"));
        assertEquals("refresh", body.get("refreshToken"));
    }

    @Test
    void testReturn401WhenPasswordIsWrong() {
        UserDTO dto = new UserDTO("john", "wrong");

        User user = new User();
        user.setLogin("john");
        user.setPasswd("encoded");

        when(userService.getUserByLogin("john")).thenReturn(new UserDTO("john", "encoded"));
        when(passwordEncoder.matches("wrong", "encoded")).thenReturn(false);

        ResponseEntity<Object> response = authController.login(dto);

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Invalid credentials", response.getBody());
    }

    @Test
    void testThrowWhenUserNotFound() {
        UserDTO dto = new UserDTO("notfound", "x");
        dto.setLogin("notfound");
        dto.setPasswd("x");

        when(userService.getUserByLogin("notfound")).thenThrow(new UserNotFoundException("user not found"));

        assertThrows(RuntimeException.class, () -> authController.login(dto));
    }
}
