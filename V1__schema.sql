-- V1__schema.sql

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'MANAGER', 'DRIVER') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(255) NOT NULL,
    manufacture_year INT NOT NULL,
    battery_percent INT NOT NULL,
    condition_status VARCHAR(255),
    status VARCHAR(50), -- e.g., ACTIVE, CHARGING, IDLE, MAINTENANCE
    latitude DOUBLE,
    longitude DOUBLE,
    total_km DOUBLE DEFAULT 0,
    last_trip_at DATETIME
);

CREATE TABLE drivers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    vehicle_id BIGINT,
    total_trips INT DEFAULT 0,
    rating DOUBLE DEFAULT 5.0,
    license_no VARCHAR(255) UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- Add driver_id to vehicles now that drivers table exists
ALTER TABLE vehicles ADD COLUMN driver_id BIGINT;
ALTER TABLE vehicles ADD FOREIGN KEY (driver_id) REFERENCES drivers(id);

CREATE TABLE battery_telemetry (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    battery_percent INT NOT NULL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE charging_stations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    connector_type VARCHAR(100),
    power_kw DOUBLE,
    available BOOLEAN DEFAULT TRUE
);

CREATE TABLE charging_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    station_id BIGINT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    energy_kwh DOUBLE,
    cost_inr DOUBLE,
    status VARCHAR(50), -- e.g., IN_PROGRESS, COMPLETED
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (station_id) REFERENCES charging_stations(id)
);

CREATE TABLE maintenance_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    alert_type VARCHAR(100),
    severity VARCHAR(50), -- CRITICAL, WARNING, GOOD
    description TEXT,
    predicted_failure_date DATE,
    resolved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE trips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    driver_id BIGINT,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    distance_km DOUBLE,
    energy_used_kwh DOUBLE,
    start_battery INT,
    end_battery INT,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

CREATE TABLE reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_type VARCHAR(100),
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    generated_by BIGINT,
    file_path VARCHAR(500),
    FOREIGN KEY (generated_by) REFERENCES users(id)
);
