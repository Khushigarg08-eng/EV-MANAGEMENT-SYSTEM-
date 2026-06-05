package com.evmanagement.backend.controller;

import com.evmanagement.backend.model.ChargingSession;
import com.evmanagement.backend.model.ChargingStation;
import com.evmanagement.backend.repository.ChargingSessionRepository;
import com.evmanagement.backend.repository.ChargingStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/charging")
public class ChargingController {

    @Autowired
    private ChargingSessionRepository sessionRepository;

    @Autowired
    private ChargingStationRepository stationRepository;

    @GetMapping("/sessions")
    public ResponseEntity<List<ChargingSession>> getAllSessions() {
        return ResponseEntity.ok(sessionRepository.findAll());
    }

    @PostMapping("/sessions")
    public ResponseEntity<ChargingSession> logSession(@RequestBody ChargingSession session) {
        return ResponseEntity.ok(sessionRepository.save(session));
    }

    @GetMapping("/stations")
    public ResponseEntity<List<ChargingStation>> getNearbyStations(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(defaultValue = "20") int radius) {
        // In a real application, calculate Haversine distance here.
        // For now, return all stations.
        return ResponseEntity.ok(stationRepository.findAll());
    }
}
