package com.evmanagement.backend.repository;

import com.evmanagement.backend.model.BatteryTelemetry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface BatteryTelemetryRepository extends JpaRepository<BatteryTelemetry, Long> {
    List<BatteryTelemetry> findByVehicleIdAndRecordedAtAfter(Long vehicleId, LocalDateTime recordedAt);
}
