package com.safety.app.controller;

import com.safety.app.model.SosAlert;
import com.safety.app.repository.SosAlertRepository;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sos")
@CrossOrigin(origins = "*")
public class SosAlertController {

    @Autowired
    private SosAlertRepository sosAlertRepository;

    @Autowired
    private EntityManager entityManager;

    @PostMapping("/trigger")
    @Transactional
    public SosAlert triggerAlert(@RequestBody SosAlert alert) {
        alert.setStatus("ACTIVE");
        SosAlert saved = sosAlertRepository.save(alert);
        entityManager.flush();
        entityManager.refresh(saved);
        return saved;
    }

    @GetMapping("/user/{userId}")
    public List<SosAlert> getAlertsByUser(@PathVariable Long userId) {
        return sosAlertRepository.findByUserId(userId);
    }

    @PutMapping("/resolve/{id}")
    public String resolveAlert(@PathVariable Long id) {
        SosAlert alert = sosAlertRepository.findById(id).orElseThrow();
        alert.setStatus("RESOLVED");
        sosAlertRepository.save(alert);
        return "Alert marked as resolved";
    }
}