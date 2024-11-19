const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

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
function calculateAirportPrice(pickup_city, vehicle_type, passengers, return_journey) {
    const basePrices = {
        'Vienna City Center': 35,
        'Schwechat': 25,
        'Linz': 180,
        'Salzburg': 280,
        'Graz': 200
    };

    const vehicleMultiplier = {
        'Standard': 1,
        'Luxury': 1.5,
        'Van': 1.8
    };

    let basePrice = basePrices[pickup_city] || 50;
    let finalPrice = basePrice * (vehicleMultiplier[vehicle_type] || 1);

    if (passengers > 4) {
        finalPrice += (passengers - 4) * 10;
    }

    if (return_journey === 'Yes') {
        finalPrice = finalPrice * 1.8;
    }

    return parseFloat(finalPrice.toFixed(2));
}

// Booking submission endpoint
app.post('/api/bookings', (req, res) => {
    const booking = {
        ...req.body,
        total_price: calculateAirportPrice(
            req.body.pickup_city,
            req.body.vehicle_type,
            parseInt(req.body.number_of_passengers),
            req.body.return_journey
        ),
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

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
