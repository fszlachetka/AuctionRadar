package com.project.act.Repositories;

import com.project.act.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByLogin(String login);

    void deleteUserByLogin(String login);

    Optional<User> findByLogin(String login);
}
