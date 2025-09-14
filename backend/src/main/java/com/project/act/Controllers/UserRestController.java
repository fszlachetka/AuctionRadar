package com.project.act.Controllers;

import com.project.act.DTOs.UserDTO;
import com.project.act.Services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api")
public class UserRestController {

    private final UserService userService;

    public UserRestController(UserService userService){
        System.out.println("rest controller start");
        this.userService = userService;
    }

    @GetMapping("/user/{login}")
    public ResponseEntity<Object> userByLogin(@PathVariable String login){
        UserDTO userDTO = userService.getUserByLogin(login);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @DeleteMapping("/user/{login}")
    public ResponseEntity<Object> delUser(@PathVariable String login){
        userService.deleteUser(login);
        return new ResponseEntity<>("added succesfully", HttpStatus.OK);
    }

    @PostMapping("/user/create")
    public ResponseEntity<Object> addUser(@Valid @RequestBody UserDTO userDTO){
        userService.addUser(userDTO);
        return new ResponseEntity<>("added succesfully", HttpStatus.OK);
    }


}
