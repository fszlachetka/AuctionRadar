package com.project.act.UnitTests.UserTests;

import com.project.act.DTOs.UserDTO;
import com.project.act.DTOs.PasswordChangeDTO;
import com.project.act.Entities.User;
import com.project.act.Exceptions.UserAlreadyExistsException;
import com.project.act.Exceptions.UserNotFoundException;
import com.project.act.Repositories.UserRepository;
import com.project.act.Services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTests {

    @InjectMocks
    UserService userService;

    @Mock
    UserRepository userRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    User user;

    UserDTO testUserDTO;

    @BeforeEach
    public void setUp(){
        user = new User();
        user.setLogin("paweł");
        user.setPasswd("brożek");

        testUserDTO = new UserDTO(user.getLogin(), user.getPasswd());
    }

    @Test
    void getUserByLoginTest(){
        when(userRepository.findByLogin(user.getLogin())).thenReturn(Optional.of(user));
        UserDTO userDTO = userService.getUserByLogin(user.getLogin());
        assertNotNull(userDTO);
        assertEquals(userDTO.getLogin(), user.getLogin());
        assertEquals(userDTO.getPasswd(), user.getPasswd());
    }

    @Test
    void testGetUserByLoginException(){
        when(userRepository.findByLogin(user.getLogin())).thenReturn(Optional.empty());
        assertThrows(UserNotFoundException.class, () -> userService.getUserByLogin(user.getLogin()));
    }

    @Test
    void testAddUser(){
        userService.addUser(testUserDTO);
        verify(passwordEncoder, times(1)).encode(any(String.class));
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testAddUserAlreadyExists(){
        when(userRepository.existsByLogin(user.getLogin())).thenReturn(true);
        assertThrows(UserAlreadyExistsException.class, () -> userService.addUser(testUserDTO));
    }

    @Test
    void testDelUser(){
        when(userRepository.existsByLogin(user.getLogin())).thenReturn(true);
        userService.deleteUser(user.getLogin());
        verify(userRepository,times(1)).deleteUserByLogin(user.getLogin());
    }

    @Test
    void testDelUserDoesNotExist(){
        when(userRepository.existsByLogin(user.getLogin())).thenReturn(false);
        assertThrows(UserNotFoundException.class, () -> userService.deleteUser(user.getLogin()));
    }

    @Test
    void testChangePasswordSuccess() {
        PasswordChangeDTO dto = new PasswordChangeDTO(user.getLogin(), "stareHaslo", "noweHaslo");

        User mockUser = new User();
        mockUser.setLogin(user.getLogin());
        mockUser.setPasswd("encodedStareHaslo");

        when(userRepository.findByLogin(user.getLogin())).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("stareHaslo", "encodedStareHaslo")).thenReturn(true);
        when(passwordEncoder.encode("noweHaslo")).thenReturn("encodedNoweHaslo");

        userService.changePassword(dto);

        verify(userRepository, times(1)).findByLogin(user.getLogin());
        verify(passwordEncoder, times(1)).matches("stareHaslo", "encodedStareHaslo");
        verify(passwordEncoder, times(1)).encode("noweHaslo");
        verify(userRepository, times(1)).save(mockUser);

        assertEquals("encodedNoweHaslo", mockUser.getPasswd());
    }


    @Test
    void testChangePasswordUserNotFound() {
        PasswordChangeDTO dto = new PasswordChangeDTO("nie_istnieje", "brożek", "noweHaslo");

        when(userRepository.findByLogin("nie_istnieje")).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.changePassword(dto));
    }

    @Test
    void testChangePasswordWrongOldPassword() {
        PasswordChangeDTO dto = new PasswordChangeDTO(user.getLogin(), "zleHaslo", "noweHaslo");

        when(userRepository.findByLogin(user.getLogin())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("zleHaslo", user.getPasswd())).thenReturn(false);

        assertThrows(RuntimeException.class, () -> userService.changePassword(dto));
    }


}
