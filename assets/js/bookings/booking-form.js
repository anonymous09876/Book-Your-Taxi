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
