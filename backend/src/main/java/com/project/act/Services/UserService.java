package com.project.act.Services;

import com.project.act.DTOs.UserDTO;
import com.project.act.Entities.User;
import com.project.act.Exceptions.UserAlreadyExistsException;
import com.project.act.Exceptions.UserNotFoundException;
import com.project.act.Mappers.UserMapper;
import com.project.act.Repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void addUser(UserDTO userDTO){
        if(userRepository.existsByLogin(userDTO.getLogin())){
            throw new UserAlreadyExistsException(userDTO.getLogin());
        }
        User user = UserMapper.toEntity(userDTO);
        user.setPasswd(passwordEncoder.encode(user.getPasswd()));
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
        Optional<User> user = userRepository.findByLogin(login);
        if(user.isEmpty()){
            throw new UserNotFoundException(login);
        }
        return UserMapper.toDTO(user.get());
    }

    public boolean checkPassword(String rawPassword, String encodedPassword){
        return passwordEncoder.matches(rawPassword,encodedPassword);
    }

}
