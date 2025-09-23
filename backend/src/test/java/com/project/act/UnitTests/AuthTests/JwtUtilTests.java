package com.project.act.UnitTests.AuthTests;

import com.project.act.Utils.JwtUtil;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class JwtUtilTests {

    JwtUtil jwtUtil = new JwtUtil("very_secret_key_for_testing_purposes_only_2142121412442");

    @Test
    void testGenerateAndValidateToken() {
        String token = jwtUtil.generateAccessToken("testUser");

        assertNotNull(token);
        assertTrue(jwtUtil.validateToken(token));
        assertEquals("testUser", jwtUtil.extractUsername(token));
    }

    @Test
    void testGenerateAndAssignTokenToUser(){
        String token = jwtUtil.generateAccessToken("testUser");
        String token2 = jwtUtil.generateAccessToken("testUser2");

        assertNotNull(token);
        assertNotNull(token2);

        assertEquals("testUser", jwtUtil.extractUsername(token));
        assertNotEquals(jwtUtil.extractUsername(token), jwtUtil.extractUsername(token2));
    }

    @Test
    void testReturnFalseForInvalidToken() {
        String invalidToken = "abc.def.ghi";
        assertFalse(jwtUtil.validateToken(invalidToken));
    }
}
