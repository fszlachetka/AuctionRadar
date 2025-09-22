package com.project.act.UnitTests.ObserwowaneTests;

import com.project.act.Controllers.ObserwowaneRestControllerAdvice;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ObserwowaneRestControllerAdviceTests {

    private final ObserwowaneRestControllerAdvice advice = new ObserwowaneRestControllerAdvice();

    @Test
    void handleRuntimeExceptionTest() {
        RuntimeException ex = new RuntimeException("test error");

        ResponseEntity<String> response = advice.handleRuntimeException(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("test error", response.getBody());
    }
}

