package com.evmanagement.backend.controller;

import com.evmanagement.backend.model.Vehicle;
import com.evmanagement.backend.model.BatteryTelemetry;
import com.evmanagement.backend.repository.VehicleRepository;
import com.evmanagement.backend.repository.BatteryTelemetryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private BatteryTelemetryRepository telemetryRepository;

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Vehicle> addVehicle(@RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(vehicleRepository.save(vehicle));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody Vehicle updatedData) {
        return vehicleRepository.findById(id).map(vehicle -> {
            vehicle.setModel(updatedData.getModel());
            vehicle.setManufactureYear(updatedData.getManufactureYear());
            vehicle.setConditionStatus(updatedData.getConditionStatus());
            vehicle.setStatus(updatedData.getStatus());
            vehicle.setBatteryPercent(updatedData.getBatteryPercent());
            vehicle.setLatitude(updatedData.getLatitude());
            vehicle.setLongitude(updatedData.getLongitude());
            return ResponseEntity.ok(vehicleRepository.save(vehicle));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long id) {
        return vehicleRepository.findById(id).map(vehicle -> {
            vehicleRepository.delete(vehicle);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/telemetry")
    public ResponseEntity<List<BatteryTelemetry>> getVehicleTelemetry(
            @PathVariable Long id,
            @RequestParam(defaultValue = "7") int days) {
        LocalDateTime timestamp = LocalDateTime.now().minusDays(days);
        List<BatteryTelemetry> history = telemetryRepository.findByVehicleIdAndRecordedAtAfter(id, timestamp);
        return ResponseEntity.ok(history);
    }
}
