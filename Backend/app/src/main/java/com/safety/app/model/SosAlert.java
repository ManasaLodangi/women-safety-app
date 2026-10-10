package com.safety.app.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "sos_alerts")
@Data
public class SosAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Double latitude;
    private Double longitude;

    @Column(name = "triggered_at", updatable = false, insertable = false)
    private LocalDateTime triggeredAt;

    private String status = "ACTIVE";
}