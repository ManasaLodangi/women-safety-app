package com.safety.app.repository;

import com.safety.app.model.SosAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SosAlertRepository extends JpaRepository<SosAlert, Long> {
    List<SosAlert> findByUserId(Long userId);
}