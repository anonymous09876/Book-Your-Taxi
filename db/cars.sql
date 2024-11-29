CREATE TABLE Cars (
    carId INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for the car
    vehicleType VARCHAR(50) NOT NULL,     -- Type of vehicle (e.g., sedan, SUV)
    capacity INT NOT NULL,                -- Passenger capacity of the vehicle
    basePrice DECIMAL(10, 2) NOT NULL,    -- Base price for the car (e.g., for rentals or services)
    carStatus ENUM('Available', 'Unavailable', 'In Maintenance') NOT NULL, -- Current status of the car
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for when the record was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Timestamp for last update
);
