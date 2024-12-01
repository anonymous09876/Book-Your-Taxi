document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const bookingData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:5050/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (result.success) {
            Toastify({
                text: "Booking successful! Your total price is €" + result.price,
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#4CAF50"
            }).showToast();

            // Reset form after successful booking
            e.target.reset();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        Toastify({
            text: "Booking failed: " + error.message,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#F44336"
        }).showToast();
    }
});





// Total Price

const PRICES = {
    baseRates: {
        'Limousine': 50,
        'Kombi': 65,
        'Mini Van': 80
    },
    locationRates: {
        'Donnerskirchen': 45,
        'Absdorf': 55,
        'Baden': 65,
        'Bad Gastein': 85,
        'Bad Ischl': 95,
        'Bibione Italien': 150,
        // Add more cities with their rates
        'default': 50 // Default price for unlisted cities
    },
    additionalCharges: {
        childrenSeat: 10,
        extraSuitcase: 5,
        returnJourney: 0.8
    }
};

function calculatePrice() {
    const vehicleType = document.querySelector('[name="vehicle_type"]').value;
    const childrenSeat = document.querySelector('[name="children_seat"]').value;
    const suitcases = parseInt(document.querySelector('[name="number_of_suitcases"]').value) || 0;
    const returnJourney = document.querySelector('[name="return_journey"]').value;
    const location = document.querySelector('[name="pickup_city"]').value;
    
    // Get location-based price or default price
    let totalPrice = PRICES.locationRates[location] || PRICES.locationRates.default;
    
    // Add vehicle type surcharge
    totalPrice += PRICES.baseRates[vehicleType] || 0;

    if (childrenSeat === 'Yes') {
        totalPrice += PRICES.additionalCharges.childrenSeat;
    }

    if (suitcases > 1) {
        totalPrice += (suitcases - 1) * PRICES.additionalCharges.extraSuitcase;
    }

    if (returnJourney === 'Yes') {
        totalPrice = totalPrice * (1 + PRICES.additionalCharges.returnJourney);
    }

    document.getElementById('totalPrice').textContent = `€${totalPrice.toFixed(2)}`;
    return totalPrice;
}

// Add pickup_city to the list of elements that trigger price updates
['vehicle_type', 'children_seat', 'number_of_suitcases', 'return_journey', 'pickup_city'].forEach(inputName => {
    document.querySelector(`[name="${inputName}"]`).addEventListener('change', calculatePrice);
});

async function fetchLocation() {
    const selectElement = document.querySelector('select[name="pickup_city"]');
    try {
        // Show loading message
        selectElement.innerHTML = '<option selected disabled>Loading...</option>';
        
        const response = await fetch('http://localhost:5050/api/locations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        populateSelectOptions(data);

    } catch (error) {
        console.error('Error fetching locations:', error);
        selectElement.innerHTML = '<option selected disabled>Error loading cities</option>';
    }
}

function populateSelectOptions(locations) {
    const selectElement = document.querySelector('select[name="pickup_city"]');
    selectElement.innerHTML = '<option selected disabled>Select City</option>';
    
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location.id; 
        option.textContent = location.name;
        selectElement.appendChild(option);
    });
}

// Fetch locations when the page loads
document.addEventListener('DOMContentLoaded', fetchLocation);


async function locationPriceHandle() {
    const locationId = document.getElementById('pickup_city').value;
    const totalPrice =  document.getElementById('totalPrice');
    try {
        // Await the fetch call
        const response = await fetch(`http://localhost:5050/api/locations/${locationId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        totalPrice.textContent  = "€ " + data.price;

    } catch (err) {
        console.error('Error fetching location price:', err);
    }
}
