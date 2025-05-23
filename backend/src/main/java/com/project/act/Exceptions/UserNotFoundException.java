package com.project.act.Exceptions;

import com.project.act.Repositories.UserRepository;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String login){
        super("User with login " + login + " cannot be found in the database");
    }
}
