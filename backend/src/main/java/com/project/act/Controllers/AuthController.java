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
@RequestMapping("/api")
public class AuthController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService, JwtUtil jwtUtil, PasswordEncoder bCryptPasswordEncoder){
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = bCryptPasswordEncoder;
    }

    @PostMapping("/user/login")
    public ResponseEntity<Object> login(@RequestBody UserDTO userDTO){
        UserDTO userBase = userService.getUserByLogin(userDTO.getLogin());

        System.out.println("entered: " + userDTO.getPasswd());
        System.out.println("base: " + userBase.getPasswd());

        if(!passwordEncoder.matches(userDTO.getPasswd(), userBase.getPasswd())){
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        String accessToken = jwtUtil.generateAccessToken(userBase.getLogin());
        String refreshToken = jwtUtil.generateRefreshToken(userBase.getLogin());

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        return ResponseEntity.ok(tokens);
    }
}

