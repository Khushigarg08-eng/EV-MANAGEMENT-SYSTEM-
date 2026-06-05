-- V2__data.sql

-- Insert Users (Passwords are BCrypt hash of 'password123')
INSERT INTO users (name, email, password_hash, role) VALUES 
('Admin User', 'admin@volttrack.com', '$2a$10$wBmaZpZ16kU6h.X/yA5xV.l3j0wRBYA1/0/S.7c35H3E4iVwJStMC', 'ADMIN'),
('Manager Dan', 'manager@volttrack.com', '$2a$10$wBmaZpZ16kU6h.X/yA5xV.l3j0wRBYA1/0/S.7c35H3E4iVwJStMC', 'MANAGER'),
('Driver John', 'john@volttrack.com', '$2a$10$wBmaZpZ16kU6h.X/yA5xV.l3j0wRBYA1/0/S.7c35H3E4iVwJStMC', 'DRIVER'),
('Driver Sally', 'sally@volttrack.com', '$2a$10$wBmaZpZ16kU6h.X/yA5xV.l3j0wRBYA1/0/S.7c35H3E4iVwJStMC', 'DRIVER');

-- Insert Vehicles
INSERT INTO vehicles (model, manufacture_year, battery_percent, condition_status, status, latitude, longitude, total_km) VALUES
('Tesla Model S', 2023, 85, 'Excellent', 'ACTIVE', 34.0522, -118.2437, 12500),
('Nissan Leaf', 2021, 42, 'Good', 'ACTIVE', 34.0530, -118.2440, 32000),
('Ford Mustang Mach-E', 2022, 15, 'Maintenance Required', 'IDLE', 34.0600, -118.2500, 18000),
('Rivian R1T', 2024, 98, 'Excellent', 'CHARGING', 34.0700, -118.2600, 5000),
('Hyundai Ioniq 5', 2023, 55, 'Good', 'ACTIVE', 34.0400, -118.2300, 21000),
('Kia EV6', 2023, 72, 'Excellent', 'ACTIVE', 34.0800, -118.2200, 15000);

-- Insert Drivers
INSERT INTO drivers (user_id, vehicle_id, total_trips, rating, license_no) VALUES 
(3, 1, 150, 4.8, 'DL12345'),
(4, 2, 85, 4.9, 'DL98765');

-- Link drivers to vehicles
UPDATE vehicles SET driver_id = 1 WHERE id = 1;
UPDATE vehicles SET driver_id = 2 WHERE id = 2;

-- Insert Charging Stations
INSERT INTO charging_stations (name, latitude, longitude, connector_type, power_kw, available) VALUES
('Downtown Supercharger', 34.0522, -118.2437, 'CCS', 150.0, TRUE),
('City Hall Station', 34.0530, -118.2440, 'CHAdeMO', 50.0, TRUE),
('Westside Charge Point', 34.0600, -118.2500, 'CCS', 350.0, FALSE);

-- Insert Telemetry
INSERT INTO battery_telemetry (vehicle_id, battery_percent, recorded_at) VALUES
(1, 95, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, 90, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 85, NOW()),
(3, 30, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(3, 15, NOW());

-- Insert Charging Sessions
INSERT INTO charging_sessions (vehicle_id, station_id, start_time, end_time, energy_kwh, cost_inr, status) VALUES
(4, 1, DATE_SUB(NOW(), INTERVAL 2 HOUR), NULL, 45.5, 950.0, 'IN_PROGRESS'),
(2, 2, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 23 HOUR), 20.0, 400.0, 'COMPLETED');

-- Insert Maintenance Alerts
INSERT INTO maintenance_alerts (vehicle_id, alert_type, severity, description, predicted_failure_date, resolved) VALUES
(3, 'Battery Degradation', 'CRITICAL', 'Battery capacity has dropped below safe operational limits.', DATE_ADD(NOW(), INTERVAL 14 DAY), FALSE),
(2, 'Tire Pressure', 'WARNING', 'Low tire pressure detected on rear left wheel.', DATE_ADD(NOW(), INTERVAL 30 DAY), FALSE);
