// js/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Protect the route: Check for user in localStorage.
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        // If no user, redirect to login immediately.
        window.location.href = 'login.html';
        return; // Stop script execution
    }

    // Update the dashboard header with the user's name
    const welcomeHeader = document.querySelector('#dashboard-header h1');
    if (welcomeHeader) {
        welcomeHeader.textContent = `Welcome, ${user.name}!`;
    }

    // 2. Fetch and display user bookings.
    fetchUserBookings(user._id);
});

/**
 * Fetches and renders the current user's bookings.
 * @param {string} userId - The ID of the logged-in user.
 */
async function fetchUserBookings(userId) {
    const bookingsContainer = document.getElementById('bookings-container');
    
    // 3. Show a loading indicator.
    bookingsContainer.innerHTML = `
        <div class="text-center mt-5">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading your bookings...</p>
        </div>
    `;

    try {
        const bookings = await api(`/bookings/user/${userId}`);
        renderBookings(bookings);
    } catch (error) {
        console.error('Fetch bookings error:', error);
        showAlert(error.message, 'danger');
        bookingsContainer.innerHTML = `<div class="alert alert-danger">Failed to load your bookings. Please try again later.</div>`;
    }
}

/**
 * Renders the user's bookings, grouped by type.
 * @param {Array} bookings - An array of booking objects from the API.
 */
function renderBookings(bookings) {
    const bookingsContainer = document.getElementById('bookings-container');

    // 4. Handle the case where there are no bookings.
    if (bookings.length === 0) {
        bookingsContainer.innerHTML = `
            <div class="card text-center">
                <div class="card-body">
                    <h5 class="card-title">No Bookings Found</h5>
                    <p class="card-text">You haven't made any bookings yet. Start exploring to plan your next trip!</p>
                    <a href="index.html" class="btn btn-primary">Start Exploring</a>
                </div>
            </div>
        `;
        return;
    }

    // Group bookings by type ('Bus', 'Hotel', 'Package')
    const groupedBookings = bookings.reduce((acc, booking) => {
        const type = booking.type;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(booking);
        return acc;
    }, {});

    let html = '';
    for (const type in groupedBookings) {
        html += `<h3 class="mb-3">${type} Bookings</h3>`;
        html += '<div class="row">';
        html += groupedBookings[type].map(booking => createBookingCard(booking)).join('');
        html += '</div><hr class="my-4">';
    }

    bookingsContainer.innerHTML = html;
}

/**
 * Creates a Bootstrap card for a single booking.
 * @param {object} booking - The booking object.
 * @returns {string} - The HTML string for the booking card.
 */
function createBookingCard(booking) {
    let detailsHtml = '';
    // Customize card details based on booking type
    switch (booking.type) {
        case 'Bus':
            detailsHtml = `
                <h5 class="card-title">${booking.details.name}</h5>
                <p class="card-text mb-1"><strong>Route:</strong> ${booking.details.from} to ${booking.details.to}</p>
                <p class="card-text"><strong>Seats:</strong> ${booking.details.seatsBooked}</p>
            `;
            break;
        case 'Hotel':
            detailsHtml = `
                <h5 class="card-title">${booking.details.name}</h5>
                <p class="card-text mb-1"><strong>City:</strong> ${booking.details.city}</p>
                <p class="card-text"><strong>Nights:</strong> ${booking.details.nights}</p>
            `;
            break;
        case 'Package':
            detailsHtml = `
                <h5 class="card-title">${booking.details.destination}</h5>
                <p class="card-text mb-1"><strong>Duration:</strong> ${booking.details.duration}</p>
            `;
            break;
        default:
            detailsHtml = `<h5 class="card-title">Unknown Booking</h5>`;
    }

    return `
        <div class="col-md-6 mb-4">
            <div class="card shadow-sm">
                <div class="card-body">
                    ${detailsHtml}
                    <hr>
                    <p class="card-text text-muted mb-1"><strong>Booking Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
                    <p class="card-text"><strong>Total Paid:</strong> ₹${booking.totalAmount}</p>
                    <span class="badge bg-success position-absolute top-0 end-0 m-2">${booking.status}</span>
                </div>
            </div>
        </div>
    `;
}

