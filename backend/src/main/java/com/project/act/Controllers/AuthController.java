package com.project.act.Controllers;

import com.project.act.DTOs.UserDTO;
import com.project.act.DTOs.UserGetDTO;
import com.project.act.Services.UserService;
import com.project.act.Utils.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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
        UserGetDTO userBase = userService.getUserDtoWithId(userDTO.getLogin());

        System.out.println("entered: " + userDTO.getPasswd());
        System.out.println("base: " + userBase.getPasswd());

        if(!passwordEncoder.matches(userDTO.getPasswd(), userBase.getPasswd())){
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        String accessToken = jwtUtil.generateAccessToken(userBase.getLogin());
        String refreshToken = jwtUtil.generateRefreshToken(userBase.getLogin());

        Map<String, String> tokens = new HashMap<>();
        tokens.put("userId", userBase.getId().toString() );
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/user/refresh")
    public ResponseEntity<Object> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.badRequest().body("Missing refresh token");
        }

        if (!jwtUtil.validateToken(refreshToken)) {
            return ResponseEntity.status(401).body("Invalid refresh token");
        }

        String username = jwtUtil.extractUsername(refreshToken);

        if (userService.getUserByLogin(username) == null) {
            return ResponseEntity.status(401).body("User not found");
        }

        String newAccessToken = jwtUtil.generateAccessToken(username);

        Map<String, String> response = new HashMap<>();
        response.put("accessToken", newAccessToken);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/me")
    public ResponseEntity<Object> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body("Invalid token");
        }

        String username = jwtUtil.extractUsername(token);
        UserDTO user = userService.getUserByLogin(username);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        return ResponseEntity.ok(user);
    }
}



