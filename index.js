const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS package

const app = express();
const port = 3000;

// Middleware to handle CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',   // Ensure this is your MySQL host (usually localhost for local dev)
    user: 'root',        // Replace with your MySQL username
    password: '',        // Replace with your MySQL password (leave empty if none)
    database: 'book_driver'  // Database name
});

// Connect to MySQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);  // Log connection error
        return;
    }
    console.log('Connected to MySQL database.');
});

// Route to handle booking data from the form (POST request)
app.post('/api/bookings', (req, res) => {
    console.log(req.body);  // Log incoming request body

    const { pickup_location, dropoff_location, passengers, vehicle_type, pickup_date, pickup_time, driver_preference, vehicle_model } = req.body;

    if (!pickup_location || !dropoff_location || !passengers || !vehicle_type || !pickup_date || !pickup_time || !driver_preference || !vehicle_model) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if booking with the same details already exists
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
            console.error('Error checking for existing booking:', err);  // Log the error
            return res.status(500).json({ message: 'Error checking booking. Please try again later.' });
        }

        if (results.length > 0) {
            // Booking already exists
            return res.status(409).json({ message: 'Data already present.' });
        }

        // If no duplicate, insert the new booking
        const insertQuery = `
            INSERT INTO bookings (pickup_location, dropoff_location, passengers, vehicle_type, pickup_date, pickup_time, driver_preference, vehicle_model)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const insertValues = [pickup_location, dropoff_location, passengers, vehicle_type, pickup_date, pickup_time, driver_preference, vehicle_model];

        db.query(insertQuery, insertValues, (err, result) => {
            if (err) {
                console.error('Error inserting booking:', err);  // Log the actual error
                return res.status(500).json({ message: 'Error saving booking. Please try again later.' });
            }
            console.log('Booking saved:', result);  // Log successful booking
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
