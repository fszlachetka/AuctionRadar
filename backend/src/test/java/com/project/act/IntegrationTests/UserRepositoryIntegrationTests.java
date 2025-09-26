package com.project.act.IntegrationTests;

import com.project.act.Entities.User;
import com.project.act.Repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.jdbc.Sql;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Transactional
@Sql("classpath:test-data.sql")
public class UserRepositoryIntegrationTests {

    @Autowired
    private UserRepository userRepository;

    @Test
    void testFindAll() {
        var users = userRepository.findAll();
        assertThat(users).hasSize(2); // Adjust size based on `test-data.sql`
    }

    @Test
    void testFindByLogin() {
        Optional<User> user = userRepository.findByLogin("existinguser");
        assertThat(user).isPresent();
        assertThat(user.get().getLogin()).isEqualTo("existinguser");
    }

    @Test
    void testFindByLoginNotFound() {
        Optional<User> user = userRepository.findByLogin("nonexistentuser");
        assertThat(user).isNotPresent();
    }

    @Test
    void testExistsByLogin() {
        boolean exists = userRepository.existsByLogin("existinguser");
        assertThat(exists).isTrue();

        boolean notExists = userRepository.existsByLogin("nonexistentuser");
        assertThat(notExists).isFalse();
    }

    @Test
    void testDeleteUserByLogin() {
        userRepository.deleteUserByLogin("existinguser");

        boolean exists = userRepository.existsByLogin("existinguser");
        assertThat(exists).isFalse();
    }

    @Test
    void testSaveUser() {
        User user = new User();
        user.setLogin("newuser");
        user.setPasswd("password123");

        userRepository.save(user);

        Optional<User> savedUser = userRepository.findByLogin("newuser");
        assertThat(savedUser).isPresent();
        assertThat(savedUser.get().getLogin()).isEqualTo("newuser");
    }
}