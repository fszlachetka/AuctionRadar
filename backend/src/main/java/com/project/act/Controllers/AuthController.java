package com.project.act.Controllers;

import com.project.act.DTOs.UserDTO;
import com.project.act.Entities.User;
import com.project.act.Mappers.UserMapper;
import com.project.act.Services.UserService;
import com.project.act.Utils.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/backend/auth")
public class AuthController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService, JwtUtil jwtUtil, PasswordEncoder bCryptPasswordEncoder){
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = bCryptPasswordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody UserDTO userDTO){
        User user = UserMapper.toEntity(userService.getUserByLogin(userDTO.getLogin()));

        if(!passwordEncoder.matches(userDTO.getPasswd(), user.getPasswd())){
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        String accessToken = jwtUtil.generateAccessToken(user.getLogin());
        String refreshToken = jwtUtil.generateRefreshToken(user.getLogin());

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        return ResponseEntity.ok(tokens);
    }
}

