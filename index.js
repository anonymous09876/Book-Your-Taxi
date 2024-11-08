require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; // Use port from .env or default to 3000

// Middleware to handle CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Connect to MySQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Route to handle booking data from the form (POST request)
app.post('/api/bookings', (req, res) => {
    const { pickup_location, dropoff_location, passengers, vehicle_type, pickup_date, pickup_time, vehicle_model } = req.body;

    if (!pickup_location || !dropoff_location || !passengers || !vehicle_type || !pickup_date || !pickup_time || !vehicle_model) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const checkQuery = `
        SELECT * FROM bookings 
        WHERE pickup_location = ? 
          AND dropoff_location = ? 
          AND pickup_date = ? 
          AND pickup_time = ?
    `;
    const checkValues = [pickup_location, dropoff_location, pickup_date, pickup_time];

    db.query(checkQuery, checkValues, (err, results) => {
        if (err) {
            console.error('Error checking for existing booking:', err);
            return res.status(500).json({ message: 'Error checking booking. Please try again later.' });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: 'Data already present.' });
        }

        const insertQuery = `
            INSERT INTO bookings (pickup_location, dropoff_location, passengers, vehicle_type, pickup_date, pickup_time, vehicle_model)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const insertValues = [pickup_location, dropoff_location, passengers, vehicle_type, pickup_date, pickup_time, vehicle_model];

        db.query(insertQuery, insertValues, (err, result) => {
            if (err) {
                console.error('Error inserting booking:', err);
                return res.status(500).json({ message: 'Error saving booking. Please try again later.' });
            }
            console.log('Booking saved:', result);
            return res.status(200).json({ message: 'Booking saved successfully.' });
        });
    });
});

// Route to fetch all bookings (GET request)
app.get('/api/bookings', (req, res) => {
    const query = 'SELECT * FROM bookings';

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching bookings:', err);
            return res.status(500).json({ message: 'Error fetching bookings. Please try again later.' });
        }

        res.status(200).json(result);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
