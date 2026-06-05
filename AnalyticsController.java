package com.evmanagement.backend.controller;

import com.evmanagement.backend.repository.VehicleRepository;
import com.evmanagement.backend.repository.ChargingSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ChargingSessionRepository sessionRepository;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        Map<String, Object> kpis = new HashMap<>();
        long totalVehicles = vehicleRepository.count();
        kpis.put("totalVehicles", totalVehicles);
        kpis.put("activeNow", vehicleRepository.findAll().stream().filter(v -> "ACTIVE".equals(v.getStatus())).count());
        kpis.put("chargingCount", vehicleRepository.findAll().stream().filter(v -> "CHARGING".equals(v.getStatus())).count());
        
        double avgBattery = vehicleRepository.findAll().stream()
                .mapToInt(v -> v.getBatteryPercent() != null ? v.getBatteryPercent() : 0)
                .average().orElse(0.0);
        kpis.put("avgBatteryPercent", avgBattery);
        
        return ResponseEntity.ok(kpis);
    }
}
