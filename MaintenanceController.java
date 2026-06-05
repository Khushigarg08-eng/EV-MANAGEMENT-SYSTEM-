package com.evmanagement.backend.controller;

import com.evmanagement.backend.model.MaintenanceAlert;
import com.evmanagement.backend.repository.MaintenanceAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    @Autowired
    private MaintenanceAlertRepository alertRepository;

    @GetMapping("/alerts")
    public ResponseEntity<List<MaintenanceAlert>> getAlerts() {
        return ResponseEntity.ok(alertRepository.findAll());
    }

    @PutMapping("/alerts/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> resolveAlert(@PathVariable Long id) {
        return alertRepository.findById(id).map(alert -> {
            alert.setResolved(true);
            alertRepository.save(alert);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
