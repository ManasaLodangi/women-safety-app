package com.safety.app.controller;

import com.safety.app.model.EmergencyContact;
import com.safety.app.repository.EmergencyContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = "*")
public class EmergencyContactController {

    @Autowired
    private EmergencyContactRepository contactRepository;

    @PostMapping("/add")
    public EmergencyContact addContact(@RequestBody EmergencyContact contact) {
        return contactRepository.save(contact);
    }

    @GetMapping("/user/{userId}")
    public List<EmergencyContact> getContactsByUser(@PathVariable Long userId) {
        return contactRepository.findByUserId(userId);
    }

    @DeleteMapping("/{id}")
    public String deleteContact(@PathVariable Long id) {
        contactRepository.deleteById(id);
        return "Contact deleted successfully";
    }
}