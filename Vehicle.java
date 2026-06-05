package com.evmanagement.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String model;
    
    @Column(name = "manufacture_year")
    private Integer manufactureYear;

    @Column(name = "battery_percent")
    private Integer batteryPercent;

    @Column(name = "condition_status")
    private String conditionStatus;
    
    private String status;
    private Double latitude;
    private Double longitude;

    @Column(name = "driver_id")
    private Long driverId;

    @Column(name = "total_km")
    private Double totalKm;

    @Column(name = "last_trip_at")
    private LocalDateTime lastTripAt;
}
