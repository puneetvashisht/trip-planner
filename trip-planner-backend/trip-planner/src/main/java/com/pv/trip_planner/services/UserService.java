package com.pv.trip_planner.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pv.trip_planner.entities.User;
import com.pv.trip_planner.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void createUser(User user) {
        userRepository.save(user);
    }

}
