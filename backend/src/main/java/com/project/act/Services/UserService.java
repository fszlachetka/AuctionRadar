package com.project.act.Services;

import com.project.act.DTOs.UserDTO;
import com.project.act.Entities.User;
import com.project.act.Exceptions.UserAlreadyExistsException;
import com.project.act.Exceptions.UserNotFoundException;
import com.project.act.Mappers.UserMapper;
import com.project.act.Repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Transactional
    public void addUser(UserDTO userDTO){
        if(userRepository.existsByLogin(userDTO.getLogin())){
            throw new UserAlreadyExistsException(userDTO.getLogin());
        }
        userRepository.save(UserMapper.toEntity(userDTO));
    }

    @Transactional
    public void deleteUser(String login){
        if(!userRepository.existsByLogin(login)){
            throw new UserNotFoundException(login);
        }
        userRepository.deleteUserByLogin(login);
    }

    public UserDTO getUserByLogin(String login){
        if(!userRepository.existsByLogin(login)){
            throw new UserNotFoundException(login);
        }
        User user = userRepository.findByLogin(login);
        return UserMapper.toDTO(user);
    }


}
