// Authentication check
if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = 'login.html';
}

// Global state
let bookingsData = [];
let currentPage = 1;
const itemsPerPage = 10;

// Sidebar Toggle Functions
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
}

// Event Listeners
document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
document.getElementById('sidebarCloseBtn').addEventListener('click', toggleSidebar);

window.addEventListener('resize', () => {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
});

// API Functions
async function fetchBookings() {
    try {
        const response = await fetch('http://localhost:5050/api/bookings');
        const data = await response.json();
        bookingsData = data.data;
        updateDashboard();
    } catch (error) {
        showToast('Error fetching bookings', 'error');
    }
}

async function updateBookingStatus(id, status) {
    try {
        const response = await fetch(`http://localhost:5050/api/bookings/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        const data = await response.json();
        if (data.success) {
            showToast('Booking updated successfully');
            fetchBookings();
        }
    } catch (error) {
        showToast('Error updating booking', 'error');
    }
}

// UI Functions
function updateDashboard() {
    updateStats();
    renderBookingsTable();
}

function updateStats() {
    const totalBookings = bookingsData.length;
    const activeBookings = bookingsData.filter(b => b.status === 'Confirmed').length;
    const todayRevenue = calculateTodayRevenue();

    document.getElementById('totalBookings').textContent = totalBookings;
    document.getElementById('activeBookings').textContent = activeBookings;
    document.getElementById('todayRevenue').textContent = formatCurrency(todayRevenue);
}

function calculateTodayRevenue() {
    const today = new Date().toISOString().split('T')[0];
    return bookingsData
        .filter(b => b.pickup_date === today && b.status === 'Completed')
        .reduce((sum, b) => sum + parseFloat(b.total_price), 0);
}

function renderBookingsTable() {
    const tbody = document.getElementById('bookingsTableBody');
    tbody.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const paginatedData = bookingsData.slice(start, start + itemsPerPage);

    paginatedData.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${booking.id}</td>
            <td>
                <div>${booking.name}</div>
                <small class="text-muted">${booking.phone_number}</small>
            </td>
            <td>
                <div>${booking.pickup_city}</div>
                <small class="text-muted">${booking.street}</small>
            </td>
            <td>
                <div>${formatDate(booking.pickup_date)}</div>
                <small class="text-muted">${booking.pickup_time}</small>
            </td>
            <td>${booking.vehicle_type}</td>
            <td>${formatCurrency(booking.total_price)}</td>
            <td><span class="badge bg-${getStatusColor(booking.status)}">${booking.status}</span></td>
            <td>
                <button onclick="editBooking(${booking.id})" class="btn btn-sm btn-primary">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('de-DE', { 
        style: 'currency', 
        currency: 'EUR' 
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('de-DE');
}

function getStatusColor(status) {
    const colors = {
        'Pending': 'warning',
        'Confirmed': 'success',
        'Completed': 'info',
        'Cancelled': 'danger'
    };
    return colors[status] || 'secondary';
}

function showToast(message, type = 'success') {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: type === 'success' ? "#4CAF50" : "#f44336"
    }).showToast();
}

// Modal Functions
const editModal = new bootstrap.Modal(document.getElementById('editModal'));

function editBooking(id) {
    const booking = bookingsData.find(b => b.id === id);
    document.getElementById('editBookingId').value = id;
    document.getElementById('editStatus').value = booking.status;
    editModal.show();
}

document.getElementById('saveChanges').addEventListener('click', async () => {
    const id = document.getElementById('editBookingId').value;
    const status = document.getElementById('editStatus').value;
    await updateBookingStatus(id, status);
    editModal.hide();
});

// Mobile responsiveness
function checkScreenSize() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    } else {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
    }
}

// Event listeners for screen resize
window.addEventListener('resize', checkScreenSize);
window.addEventListener('load', checkScreenSize);

// Initialize the dashboard
fetchBookings();
setInterval(fetchBookings, 30000); // Refresh every 30 seconds