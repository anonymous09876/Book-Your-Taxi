document.addEventListener('DOMContentLoaded', function() {
    loadLocations();

    // Add event listeners for forms
    document.getElementById('saveLocationBtn').addEventListener('click', saveLocation);
    document.getElementById('updateLocationBtn').addEventListener('click', updateLocation);
});

async function loadLocations() {
    try {
        const response = await fetch('http://localhost:5050/api/locations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('API Response:', response);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Locations data:', data);
        renderLocationsTable(data);
        
        showToast('Locations loaded successfully', 'success');
    } catch (error) {
        console.error('Fetch error:', error);
        showToast('Error loading locations: ' + error.message, 'error');
    }
}

function renderLocationsTable(locations) {
    const tbody = document.getElementById('locationsTableBody');
    tbody.innerHTML = '';
    
    locations.forEach(location => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${location.id}</td>
            <td>${location.name}</td>
            <td>€${location.base_price}</td>
            <td><span class="badge ${location.status === 'active' ? 'bg-success' : 'bg-danger'}">${location.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="openEditLocationModal(${location.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteLocation(${location.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function saveLocation(event) {
    event.preventDefault(); // Prevent form submission that reloads the page

    const name = document.getElementById('locationName').value;
    const basePrice = document.getElementById('basePrice').value;

    if (!name || !basePrice) {
        showToast('Please fill all fields', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:5050/api/locations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, basePrice })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        showToast('Location added successfully', 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('addLocationModal'));
        modal.hide();
        loadLocations();
    } catch (error) {
        console.error('Fetch error:', error);
        showToast('Error adding location: ' + error.message, 'error');
    }
}

async function openEditLocationModal(id) {
    try {
        const response = await fetch(`http://localhost:5050/api/locations/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const location = await response.json();
        document.getElementById('editLocationId').value = id;
        document.getElementById('editLocationName').value = location.name;
        document.getElementById('editBasePrice').value = location.base_price;

        const modal = new bootstrap.Modal(document.getElementById('editLocationModal'));
        modal.show();
    } catch (error) {
        console.error('Fetch error:', error);
        showToast('Error fetching location details: ' + error.message, 'error');
    }
}

async function openEditLocationModal(id) {
    console.log(`Fetching location with ID: ${id}`);

    try {
        const response = await fetch(`http://localhost:5050/api/locations/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const location = await response.json();
        document.getElementById('editLocationId').value = id;
        document.getElementById('editLocationName').value = location.name;
        document.getElementById('editBasePrice').value = location.base_price;

        const modal = new bootstrap.Modal(document.getElementById('editLocationModal'));
        modal.show();
    } catch (error) {
        console.error('Fetch error:', error);
        showToast('Error fetching location details: ' + error.message, 'error');
    }
}


async function deleteLocation(id) {
    if (confirm('Are you sure you want to delete this location?')) {
        try {
            const response = await fetch(`http://localhost:5050/api/locations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            showToast('Location deleted successfully', 'success');
            loadLocations();
        } catch (error) {
            console.error('Fetch error:', error);
            showToast('Error deleting location: ' + error.message, 'error');
        }
    }
}

function showToast(message, type) {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: type === 'success' ? "#4caf50" : "#f44336"
    }).showToast();
}
