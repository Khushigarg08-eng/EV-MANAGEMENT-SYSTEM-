package com.evmanagement.backend.controller;

import com.evmanagement.backend.model.Driver;
import com.evmanagement.backend.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    @Autowired
    private DriverRepository driverRepository;

    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(driverRepository.findAll());
    }

    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> assignDriver(@RequestBody Map<String, Long> request) {
        Long driverId = request.get("driverId");
        Long vehicleId = request.get("vehicleId");
        
        return driverRepository.findById(driverId).map(driver -> {
            driver.setVehicleId(vehicleId);
            driverRepository.save(driver);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
