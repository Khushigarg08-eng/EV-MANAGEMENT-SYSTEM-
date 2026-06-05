package com.evmanagement.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "vehicle_id")
    private Long vehicleId;

    @Column(name = "total_trips")
    private Integer totalTrips;

    private Double rating;

    @Column(name = "license_no", unique = true)
    private String licenseNo;
}
