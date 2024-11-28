document.addEventListener('DOMContentLoaded', function () {
    loadCars();
});

async function loadCars() {
    try {
        const response = await fetch('http://localhost:5050/api/cars', { method: 'GET' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const cars = await response.json();
        renderCarsTable(cars);
    } catch (error) {
        showToast('Error loading cars: ' + error.message, 'error');
    }
}

function renderCarsTable(cars) {
    const tbody = document.getElementById('carsTableBody');
    tbody.innerHTML = '';

    cars.forEach(car => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${car.id}</td>
            <td>${car.vehicleType}</td>
            <td>${car.capacity}</td>
            <td>€${car.basePrice}</td>
            <td><img src="http://localhost:5050${car.image}" alt="Car Image" style="width: 50px; height: auto;"></td>
            <td><span class="badge ${car.status === 'active' ? 'bg-success' : 'bg-danger'}">${car.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="openEditCarModal(${car.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deleteCar(${car.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function saveCar() {
    const form = document.getElementById('carForm');
    const formData = new FormData(form);
    const id = formData.get('id');
    const method = id ? 'PUT' : 'POST';
    const url = id ? `http://localhost:5050/api/cars/${id}` : 'http://localhost:5050/api/cars';

    try {
        const response = await fetch(url, { method, body: formData });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        showToast(id ? 'Car updated successfully' : 'Car added successfully', 'success');
        bootstrap.Modal.getInstance(document.getElementById('carModal')).hide();
        loadCars();
    } catch (error) {
        showToast('Error saving car: ' + error.message, 'error');
    }
}

async function deleteCar(id) {
    if (!confirm('Are you sure you want to delete this car?')) return;
    try {
        const response = await fetch(`http://localhost:5050/api/cars/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        showToast('Car deleted successfully', 'success');
        loadCars();
    } catch (error) {
        showToast('Error deleting car: ' + error.message, 'error');
    }
}

async function openEditCarModal(id) {
    try {
        const response = await fetch(`http://localhost:5050/api/cars/${id}`, { method: 'GET' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const car = await response.json();
        document.getElementById('carId').value = car.id;
        document.getElementById('vehicleType').value = car.vehicleType;
        document.getElementById('capacity').value = car.capacity;
        document.getElementById('carPrice').value = car.basePrice;
        document.getElementById('carStatus').value = car.status;
        bootstrap.Modal.getInstance(document.getElementById('carModal')).show();
    } catch (error) {
        showToast('Error fetching car details: ' + error.message, 'error');
    }
}

function showToast(message, type) {
    Toastify({
        text: message,
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: type === 'success' ? '#4caf50' : '#f44336',
    }).showToast();
}
