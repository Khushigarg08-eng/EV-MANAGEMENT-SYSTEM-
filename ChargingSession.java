package com.evmanagement.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "charging_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChargingSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicle_id")
    private Long vehicleId;

    @Column(name = "station_id")
    private Long stationId;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "energy_kwh")
    private Double energyKwh;

    @Column(name = "cost_inr")
    private Double costInr;

    private String status; // IN_PROGRESS, COMPLETED
}
