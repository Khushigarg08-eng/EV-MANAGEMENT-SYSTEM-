package com.evmanagement.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "maintenance_alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicle_id")
    private Long vehicleId;

    @Column(name = "alert_type")
    private String alertType;

    private String severity; // CRITICAL, WARNING, GOOD
    
    @Column(columnDefinition="TEXT")
    private String description;

    @Column(name = "predicted_failure_date")
    private LocalDate predictedFailureDate;

    private Boolean resolved = false;
}
