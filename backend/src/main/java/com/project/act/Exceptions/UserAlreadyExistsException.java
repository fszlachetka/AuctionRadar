package com.project.act.Exceptions;

import org.apache.catalina.User;

public class UserAlreadyExistsException extends RuntimeException{
    public UserAlreadyExistsException(String login){
        super("user by login: " + login + " already exists");
    }
}
