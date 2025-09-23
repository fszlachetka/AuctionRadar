package com.project.act.Exceptions;
public class UserAlreadyExistsException extends RuntimeException{
    public UserAlreadyExistsException(String login){
        super("user by login: " + login + " already exists");
    }
}
