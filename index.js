const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection with connection testing
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'taxi_bookings',
    waitForConnections: true,
    connectionLimit: 10
});

// Test database connection
db.getConnection((err, connection) => {
    if (err) {
        console.log('Database connection failed:', err);
    } else {
        console.log('Database connected successfully');
        connection.release();
    }
});

// Price calculation function
// function calculateAirportPrice(pickup_city, vehicle_type, passengers, return_journey) {
//     const basePrices = {
//         'Vienna City Center': 35,
//         'Schwechat': 25,
//         'Linz': 180,
//         'Salzburg': 280,
//         'Graz': 200
//     };

//     const vehicleMultiplier = {
//         'Standard': 1,
//         'Luxury': 1.5,
//         'Van': 1.8
//     };

//     let basePrice = basePrices[pickup_city] || 50;
//     let finalPrice = basePrice * (vehicleMultiplier[vehicle_type] || 1);

//     if (passengers > 4) {
//         finalPrice += (passengers - 4) * 10;
//     }

//     if (return_journey === 'Yes') {
//         finalPrice = finalPrice * 1.8;
//     }

//     return parseFloat(finalPrice.toFixed(2));
// }

// Booking submission endpoint
app.post('/api/bookings', (req, res) => {
    const booking = {
        ...req.body,
        
        status: 'Pending',
        created_at: new Date(),
        updated_at: new Date()
    };

    const query = 'INSERT INTO bookings SET ?';
    db.query(query, booking, (err, result) => {
        if (err) {
            console.error('Booking error:', err);
            return res.status(500).json({
                success: false,
                message: 'Error processing booking',
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking successful',
            bookingId: result.insertId,
            price: booking.total_price
        });
    });
});

// Get bookings with pagination
app.get('/api/bookings', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const query = `
        SELECT * FROM bookings 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
    `;

    db.query(query, [limit, offset], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error fetching bookings'
            });
        }
        
        db.query('SELECT COUNT(*) as total FROM bookings', (err, countResult) => {
            const total = countResult[0].total;
            res.json({
                success: true,
                data: results,
                pagination: {
                    current_page: page,
                    total_pages: Math.ceil(total / limit),
                    total_records: total
                }
            });
        });
    });
});

// Update booking status
app.patch('/api/bookings/:id', (req, res) => {
    const query = 'UPDATE bookings SET status = ?, updated_at = NOW() WHERE id = ?';
    db.query(query, [req.body.status, req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error updating booking'
            });
        }
        res.json({
            success: true,
            message: 'Booking updated successfully'
        });
    });
});

// Delete booking endpoint
app.delete('/api/bookings/:id', (req, res) => {
    const query = 'DELETE FROM bookings WHERE id = ?';
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error deleting booking'
            });
        }
        res.json({
            success: true,
            message: 'Booking deleted successfully'
        });
    });
});



// Get all locations
app.get('/api/locations', (req, res) => {
    const query = 'SELECT * FROM locations ORDER BY id';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Get single location by ID
app.get('/api/locations/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM locations WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Location not found' });
        }

        res.json(results[0]); // Send back the first (and only) result
    });
});

// Add new location
app.post('/api/locations', (req, res) => {
    const { name, price } = req.body;
    const query = 'INSERT INTO locations (name, price, status) VALUES (?, ?, ?)';
    
    db.query(query, [name, price, 'active'], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            id: result.insertId,
            name,
            price: price,
            status: 'active'
        });
    });
});

// update location
app.put('/api/update-locations', (req, res) => {
    const { name, price , id } = req.body;
    console.log(req.body);
    const query = 'UPDATE locations set name = ? , price = ? WHERE id = ?';
    
    db.query(query, [name, price, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            id: result.id,
            name,
            price
        });
    });
});


// Delete location
app.delete('/api/locations/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM locations WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Location deleted successfully' });
    });
});



// POST: Add a new car
app.post('/api/cars', (req, res) => {
    const { vehicleType, capacity, basePrice, image, status } = req.body;

    // Validation (basic)
    if (!vehicleType || !capacity || !basePrice || !status) {
        return res.status(400).json({
            error: 'All fields are required: vehicleType, capacity, basePrice, status'
        });
    }

    // Insert car into database
    const query = 'INSERT INTO cars (vehicleType, capacity, basePrice, image, status) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [vehicleType, capacity, basePrice, image, status], (err, result) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
            success: true,
            id: result.insertId,
            vehicleType,
            capacity,
            basePrice,
            image,
            status
        });
    });
});

// GET: Get all cars
app.get('/api/cars', (req, res) => {
    const query = 'SELECT * FROM cars ORDER BY id';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// GET: Get a single car by ID
app.get('/api/cars/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM cars WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }

        res.json(results[0]);
    });
});

// PUT: Update car details
app.put('/api/cars/:id', (req, res) => {
    const { id } = req.params;
    const { vehicleType, capacity, basePrice, image, status } = req.body;

    // Validation (basic)
    if (!vehicleType || !capacity || !basePrice || !status) {
        return res.status(400).json({
            error: 'All fields are required: vehicleType, capacity, basePrice, status'
        });
    }

    const query = 'UPDATE cars SET vehicleType = ?, capacity = ?, basePrice = ?, image = ?, status = ? WHERE id = ?';
    db.query(query, [vehicleType, capacity, basePrice, image, status, id], (err, result) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }

        res.json({
            success: true,
            message: 'Car updated successfully'
        });
    });
});

// DELETE: Delete car by ID
app.delete('/api/cars/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM cars WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }

        res.json({
            success: true,
            message: 'Car deleted successfully'
        });
    });
});





const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
