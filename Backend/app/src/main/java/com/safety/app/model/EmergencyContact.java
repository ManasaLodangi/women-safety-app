package com.safety.app.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "emergency_contacts")
@Data
public class EmergencyContact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String contactName;
    private String contactPhone;
    private String relationship;
}