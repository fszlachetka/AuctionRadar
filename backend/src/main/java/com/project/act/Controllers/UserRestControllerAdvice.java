package com.project.act.Controllers;

import com.project.act.Exceptions.UserAlreadyExistsException;
import com.project.act.Exceptions.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class UserRestControllerAdvice {
    @ExceptionHandler(UserNotFoundException.class)
    public final ResponseEntity<Object> bankNotFoundHandler(RuntimeException e) {
        return new ResponseEntity<>("user not found", HttpStatus.BANDWIDTH_LIMIT_EXCEEDED);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public final ResponseEntity<Object> userAlreadyExistsHandler(RuntimeException e) {
        return new ResponseEntity<>("user already exists", HttpStatus.UNPROCESSABLE_ENTITY);
    }

}
