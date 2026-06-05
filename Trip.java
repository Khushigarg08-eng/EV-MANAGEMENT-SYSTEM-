package com.evmanagement.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicle_id")
    private Long vehicleId;

    @Column(name = "driver_id")
    private Long driverId;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "distance_km")
    private Double distanceKm;

    @Column(name = "energy_used_kwh")
    private Double energyUsedKwh;

    @Column(name = "start_battery")
    private Integer startBattery;

    @Column(name = "end_battery")
    private Integer endBattery;
}
