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

// Define pricing based on vehicle type and other factors
const basePricePerKm = 2; // Price per kilometer
const vehicleTypeMultiplier = {
    "Standard": 1,
    "Hybrid": 1.2,
    "Luxury": 1.5
};

const vehicleModelMultiplier = {
    "No Preference": 1,
    "Mercedes E-Class": 1.3,
    "BMW 7 Series": 1.4,
    "Audi A8": 1.5
};

// Calculate the price based on the cities and multipliers
const cityDistances = {
    'Berlin-Hamburg': 289,
    'Berlin-Munich': 585,
    'Berlin-Cologne': 571,
    'Berlin-Frankfurt am Main': 545,
    'Hamburg-Munich': 774,
    'Hamburg-Cologne': 360,
    'Hamburg-Frankfurt am Main': 492,
    'Munich-Cologne': 574,
    'Munich-Frankfurt am Main': 394,
    'Cologne-Frankfurt am Main': 191,
    'Berlin-Stuttgart': 582,
    'Berlin-Düsseldorf': 535,
    'Hamburg-Stuttgart': 681,
    'Hamburg-Düsseldorf': 415,
    'Munich-Stuttgart': 220,
    'Munich-Düsseldorf': 600,
    'Cologne-Stuttgart': 250,
    'Cologne-Düsseldorf': 30,
    'Frankfurt am Main-Stuttgart': 220,
    'Frankfurt am Main-Düsseldorf': 190,
    // Add more cities as needed
};

// Helper function to calculate price based on locations and other factors
function calculatePrice(pickup_location, dropoff_location, passengers, vehicle_type, vehicle_model) {
    const cityKey = `${pickup_location}-${dropoff_location}`;
    const reverseCityKey = `${dropoff_location}-${pickup_location}`;
    let distance = cityDistances[cityKey] || cityDistances[reverseCityKey];
    
    if (distance) {
        let price = distance * basePricePerKm; // Calculate price based on distance
        price *= vehicleTypeMultiplier[vehicle_type]; // Apply vehicle type multiplier
        price *= vehicleModelMultiplier[vehicle_model]; // Apply vehicle model multiplier

        // Add extra cost for passengers over 4
        if (passengers > 4) {
            price += (passengers - 4) * 5; // For example, $5 extra per passenger above 4
        }

        return price;
    } else {
        return null; // Distance not found
    }
}

// Route to handle booking data from the form (POST request)
app.post('/api/bookings', (req, res) => {
    const { pickup_location, dropoff_location, passengers, vehicle_type, pickup_date, pickup_time, vehicle_model } = req.body;

    // Validate input
    if (!pickup_location || !dropoff_location || !passengers || !vehicle_type || !pickup_date || !pickup_time || !vehicle_model) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Calculate the price
    const price = calculatePrice(pickup_location, dropoff_location, passengers, vehicle_type, vehicle_model);

    if (price === null) {
        return res.status(400).json({ message: 'Invalid locations. Distance not found.' });
    }

    // Log the calculated price for debugging
    console.log('Calculated Price:', price);

    // Check if the booking already exists
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
            return res.status(409).json({ message: 'Booking already exists.' });
        }

        // Insert the booking data into the database
        const insertQuery = `
            INSERT INTO bookings (pickup_location, dropoff_location, passengers, vehicle_type, pickup_date, pickup_time, vehicle_model, price)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const insertValues = [pickup_location, dropoff_location, passengers, vehicle_type, pickup_date, pickup_time, vehicle_model, price];

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
