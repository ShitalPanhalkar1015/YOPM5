// js/bus.js

document.addEventListener('DOMContentLoaded', () => {
    const busSearchForm = document.getElementById('bus-search-form');
    if (busSearchForm) {
        busSearchForm.addEventListener('submit', handleBusSearch);
    }
});

/**
 * Handles the bus search form submission.
 * @param {Event} e - The form submission event.
 */
async function handleBusSearch(e) {
    e.preventDefault();
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const date = document.getElementById('date').value;
    const resultsContainer = document.getElementById('bus-results');
    const searchButton = e.target.querySelector('button[type="submit"]');

    if (!from || !to || !date) {
        showAlert('Please fill in all search fields.', 'warning');
        return;
    }

    // Show loading state
    resultsContainer.innerHTML = `<div class="text-center mt-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Searching for buses...</p></div>`;
    searchButton.disabled = true;

    try {
        const endpoint = `/bus?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`;
        const buses = await api(endpoint);
        renderBusResults(buses);
    } catch (error) {
        console.error('Bus search error:', error);
        showAlert(error.message, 'danger');
        resultsContainer.innerHTML = `<div class="alert alert-danger">Failed to load bus results. Please try again later.</div>`;
    } finally {
        searchButton.disabled = false;
    }
}

/**
 * Renders the bus search results on the page.
 * @param {Array} buses - An array of bus objects.
 */
function renderBusResults(buses) {
    const resultsContainer = document.getElementById('bus-results');
    if (buses.length === 0) {
        resultsContainer.innerHTML = '<div class="alert alert-info">No buses found for the selected route and date.</div>';
        return;
    }

    const busCards = buses.map(bus => `
        <div class="col-md-12 mb-4">
            <div class="card shadow-sm">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title">${bus.name}</h5>
                        <p class="card-text mb-1">
                            <strong>Departure:</strong> ${bus.departureTime} | 
                            <strong>Arrival:</strong> ${bus.arrivalTime}
                        </p>
                        <p class="card-text text-muted">Seats Available: ${bus.seatsAvailable}</p>
                    </div>
                    <div class="text-end">
                        <h4 class="text-primary fw-bold">₹${bus.price}</h4>
                        <button class="btn btn-primary" id="book-btn-${bus._id}" onclick="bookBus('${bus._id}', 1)">Book Now</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    resultsContainer.innerHTML = `<h3 class="mb-4">Available Buses</h3><div class="row">${busCards}</div>`;
}

/**
 * Handles the booking of a bus.
 * @param {string} busId - The ID of the bus to book.
 * @param {number} seats - The number of seats to book.
 */
async function bookBus(busId, seats) {
    // Check if user is logged in before allowing booking
    if (!localStorage.getItem('token')) {
        showAlert('You must be logged in to book a ticket.', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    const bookButton = document.getElementById(`book-btn-${busId}`);
    bookButton.disabled = true;
    bookButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Booking...';
    
    try {
        const result = await api('/bus/book', 'POST', { busId, seats });
        showAlert('Bus booked successfully!', 'success');
        console.log('Booking successful:', result);
        // Optionally, redirect to dashboard or update UI
    } catch (error) {
        console.error('Booking error:', error);
        showAlert(error.message, 'danger');
    } finally {
        bookButton.disabled = false;
        bookButton.innerHTML = 'Book Now';
    }
}

