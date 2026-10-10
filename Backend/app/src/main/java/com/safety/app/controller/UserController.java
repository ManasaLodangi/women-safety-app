package com.safety.app.controller;

import com.safety.app.model.User;
import com.safety.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User loginRequest) {
        return userRepository.findByEmail(loginRequest.getEmail())
            .filter(u -> u.getPassword().equals(loginRequest.getPassword()))
            .map(u -> "Login successful")
            .orElse("Invalid credentials");
    }

    @GetMapping
    public Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }
}