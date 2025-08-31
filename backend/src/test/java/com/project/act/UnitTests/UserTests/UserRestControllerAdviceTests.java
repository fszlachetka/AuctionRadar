package com.project.act.UnitTests.UserTests;

import com.project.act.Controllers.UserRestControllerAdvice;
import com.project.act.Exceptions.UserAlreadyExistsException;
import com.project.act.Exceptions.UserNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;


public class UserRestControllerAdviceTests {

    private final UserRestControllerAdvice userRestControllerAdvice = new UserRestControllerAdvice();

    @Test
    void UserNotFoundExceptionTest(){
        UserNotFoundException userNotFoundException = new UserNotFoundException("exception");
        ResponseEntity<Object> response = userRestControllerAdvice.userNotFoundHandler(userNotFoundException);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
    @Test
    void UserAlreadyExistsExceptionTest(){
        UserAlreadyExistsException userAlreadyExistsException = new UserAlreadyExistsException("exception");
        ResponseEntity<Object> response = userRestControllerAdvice.userAlreadyExistsHandler(userAlreadyExistsException);
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, response.getStatusCode());
    }

}
