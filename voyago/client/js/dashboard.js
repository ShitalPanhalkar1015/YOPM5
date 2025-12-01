// js/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }

    // Update welcome message
    const header = document.getElementById('dashboard-header');
    if (header) {
        header.querySelector('h1').textContent = `Welcome back, ${user.name}!`;
    }

    fetchUserBookings(user._id);
});

/**
 * Fetches the user's bookings from the API.
 * @param {string} userId - The ID of the logged-in user.
 */
async function fetchUserBookings(userId) {
    const bookingsContainer = document.getElementById('bookings-container');
    
    // Show loading state
    bookingsContainer.innerHTML = `<div class="text-center mt-5 w-100"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading your bookings...</p></div>`;

    try {
        const bookings = await api(`/bookings/user/${userId}`);
        renderBookings(bookings);
    } catch (error) {
        console.error('Fetch bookings error:', error);
        showAlert(error.message, 'danger');
        bookingsContainer.innerHTML = `<div class="alert alert-danger w-100">Failed to load your bookings. Please try again later.</div>`;
    }
}

/**
 * Renders the user's bookings on the dashboard.
 * @param {Array} bookings - An array of booking objects.
 */
function renderBookings(bookings) {
    const bookingsContainer = document.getElementById('bookings-container');
    
    if (bookings.length === 0) {
        bookingsContainer.innerHTML = '<div class="alert alert-info w-100">You have no bookings yet. Start exploring and book your next trip!</div>';
        return;
    }

    const bookingCards = bookings.map(booking => {
        let icon = 'bi-calendar-check';
        let title = 'Booking';
        let detailsHtml = '';

        if (booking.type === 'Bus') {
            icon = 'bi-bus-front-fill';
            title = `Bus Ticket: ${booking.details.from} to ${booking.details.to}`;
            detailsHtml = `
                <p class="text-muted mb-1"><i class="bi bi-calendar-event"></i> Date: ${new Date(booking.details.date).toLocaleDateString()}</p>
                <p class="text-muted mb-1"><i class="bi bi-people"></i> Seats: ${booking.details.seatsBooked}</p>
            `;
        } else if (booking.type === 'Hotel') {
            icon = 'bi-building-fill';
            title = `Hotel Stay: ${booking.details.hotelName}`; // Assuming hotelName is stored in details
            detailsHtml = `
                <p class="text-muted mb-1"><i class="bi bi-calendar-check"></i> Check-in: ${new Date(booking.details.checkIn).toLocaleDateString()}</p>
                <p class="text-muted mb-1"><i class="bi bi-calendar-x"></i> Check-out: ${new Date(booking.details.checkOut).toLocaleDateString()}</p>
                <p class="text-muted mb-1"><i class="bi bi-people"></i> Guests: ${booking.details.guests}</p>
            `;
        } else if (booking.type === 'Flight') {
            icon = 'bi-airplane-engines';
            title = `Flight: ${booking.details.from} to ${booking.details.to}`;
            detailsHtml = `
                <p class="text-muted mb-1"><i class="bi bi-calendar-event"></i> Date: ${new Date(booking.details.date).toLocaleDateString()}</p>
                <p class="text-muted mb-1"><i class="bi bi-airplane"></i> Airline: ${booking.details.airline} (${booking.details.flightNumber})</p>
                <p class="text-muted mb-1"><i class="bi bi-people"></i> Seats: ${booking.details.seatsBooked}</p>
            `;
        } else if (booking.type === 'Package') {
            icon = 'bi-globe-americas';
            title = `Package: ${booking.details.destination}`;
            detailsHtml = `
                <p class="text-muted mb-1"><i class="bi bi-clock"></i> Duration: ${booking.details.duration}</p>
            `;
        }

        const statusBadgeClass = booking.status === 'Confirmed' ? 'bg-success' : (booking.status === 'Pending' ? 'bg-warning' : 'bg-danger');
        
        // Add Cancel Button if status is not Cancelled
        let actionButtons = '';
        if (booking.status !== 'Cancelled') {
            actionButtons = `
                <button class="btn btn-outline-danger btn-sm mt-3 cancel-booking-btn" data-id="${booking._id}">
                    Cancel Booking
                </button>
            `;
        }

        return `
            <div class="col" data-aos="fade-up">
                <div class="voyago-card p-4 h-100">
                    <div class="d-flex align-items-start gap-3">
                        <div class="rounded-circle bg-primary-50 p-3 text-primary-600">
                            <i class="bi ${icon} fs-4"></i>
                        </div>
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="fw-bold text-neutral-900 mb-0">${title}</h5>
                                <span class="badge ${statusBadgeClass}">${booking.status}</span>
                            </div>
                            <div class="mb-3">
                                ${detailsHtml}
                                <p class="text-muted mb-0"><small>Booking ID: ${booking._id}</small></p>
                            </div>
                            <div class="border-top pt-3 d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small d-block">Total Amount</span>
                                    <span class="fw-bold text-primary-600 fs-5">₹${booking.totalAmount.toLocaleString()}</span>
                                </div>
                                ${actionButtons}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    bookingsContainer.innerHTML = bookingCards;

    // Attach event listeners to cancel buttons
    document.querySelectorAll('.cancel-booking-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const bookingId = e.target.getAttribute('data-id');
            handleCancelBooking(bookingId);
        });
    });
}

/**
 * Handles the cancellation of a booking.
 * @param {string} bookingId - The ID of the booking to cancel.
 */
async function handleCancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
        return;
    }

    try {
        await api(`/bookings/${bookingId}/cancel`, 'PUT');
        showAlert('Booking cancelled successfully.', 'success');
        
        // Refresh the bookings list
        const user = JSON.parse(localStorage.getItem('user'));
        fetchUserBookings(user._id);
    } catch (error) {
        console.error('Cancel booking error:', error);
        showAlert(error.message, 'danger');
    }
}
