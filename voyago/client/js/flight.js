// js/flight.js

document.addEventListener('DOMContentLoaded', () => {
    const flightSearchForm = document.getElementById('flight-search-form');
    if (flightSearchForm) {
        flightSearchForm.addEventListener('submit', handleFlightSearch);
    }
});

/**
 * Handles the flight search form submission.
 * @param {Event} e - The form submission event.
 */
async function handleFlightSearch(e) {
    e.preventDefault();
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const date = document.getElementById('date').value;
    const resultsContainer = document.getElementById('flight-results');
    const searchButton = e.target.querySelector('button[type="submit"]');

    if (!from || !to || !date) {
        showAlert('Please fill in all search fields.', 'warning');
        return;
    }

    // Show loading state
    resultsContainer.innerHTML = `<div class="text-center mt-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Searching for flights...</p></div>`;
    searchButton.disabled = true;

    try {
        const endpoint = `/flights?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`;
        const flights = await api(endpoint);
        renderFlightResults(flights);
    } catch (error) {
        console.error('Flight search error:', error);
        showAlert(error.message, 'danger');
        resultsContainer.innerHTML = `<div class="alert alert-danger">Failed to load flight results. Please try again later.</div>`;
    } finally {
        searchButton.disabled = false;
    }
}

/**
 * Renders the flight search results on the page.
 * @param {Array} flights - An array of flight objects.
 */
function renderFlightResults(flights) {
    const resultsContainer = document.getElementById('flight-results');
    if (flights.length === 0) {
        resultsContainer.innerHTML = '<div class="alert alert-info">No flights found for the selected route and date.</div>';
        return;
    }

    const flightCards = flights.map(flight => `
        <div class="col-md-12 mb-4" data-aos="fade-up">
            <div class="voyago-card p-4">
                <div class="row align-items-center">
                    <div class="col-md-5">
                        <div class="d-flex align-items-center mb-2">
                            <i class="bi bi-airplane-engines fs-3 text-primary-500 me-3"></i>
                            <div>
                                <h5 class="card-title mb-1">${flight.airline} <small class="text-muted">(${flight.flightNumber})</small></h5>
                                <p class="text-muted small mb-0">
                                    <i class="bi bi-geo-alt-fill text-primary-500"></i> ${flight.from} 
                                    <i class="bi bi-arrow-right mx-2"></i> ${flight.to}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="d-flex gap-3 align-items-center">
                            <div class="text-center">
                                <p class="mb-0 fw-bold text-neutral-900 fs-5">${flight.departureTime}</p>
                                <small class="text-muted"><i class="bi bi-clock me-1"></i>Departure</small>
                            </div>
                            <div class="text-center">
                                <small class="text-muted d-block mb-1">${flight.duration}</small>
                                <i class="bi bi-arrow-right-circle text-primary-500"></i>
                            </div>
                            <div class="text-center">
                                <p class="mb-0 fw-bold text-neutral-900 fs-5">${flight.arrivalTime}</p>
                                <small class="text-muted"><i class="bi bi-clock me-1"></i>Arrival</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2 text-center my-3 my-md-0">
                        <span class="badge ${flight.seatsAvailable > 20 ? 'bg-success' : flight.seatsAvailable > 10 ? 'bg-warning' : 'bg-danger'} px-3 py-2">
                            <i class="bi bi-person-check-fill me-1"></i>${flight.seatsAvailable} Seats
                        </span>
                    </div>
                    <div class="col-md-2 text-end">
                        <div class="price-amount mb-2">₹${flight.price}</div>
                        <div class="d-flex align-items-center justify-content-end gap-2">
                            <input type="number" id="seats-${flight._id}" class="form-control form-control-sm" style="width: 60px;" value="1" min="1" max="${flight.seatsAvailable}">
                            <button class="btn btn-primary btn-sm" id="book-btn-${flight._id}" onclick="initiateFlightBooking('${flight._id}')">
                                <i class="bi bi-ticket-perforated me-1"></i>Book
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    resultsContainer.innerHTML = `<h3 class="mb-4 text-primary-800">Available Flights</h3><div class="row">${flightCards}</div>`;
}

/**
 * Initiates the flight booking process.
 * @param {string} flightId - The ID of the flight to book.
 */
async function initiateFlightBooking(flightId) {
    const seatsInput = document.getElementById(`seats-${flightId}`);
    const seats = parseInt(seatsInput.value);

    if (seats < 1) {
        showAlert('Please select at least 1 seat.', 'warning');
        return;
    }

    bookFlight(flightId, seats);
}

/**
 * Handles the booking of a flight.
 * @param {string} flightId - The ID of the flight to book.
 * @param {number} seats - The number of seats to book.
 */
async function bookFlight(flightId, seats) {
    // Check if user is logged in before allowing booking
    if (!localStorage.getItem('token')) {
        showAlert('You must be logged in to book a ticket.', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    const bookButton = document.getElementById(`book-btn-${flightId}`);
    bookButton.disabled = true;
    bookButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Booking...';
    
    try {
        const result = await api('/flights/book', 'POST', { flightId, seats });
        showAlert('Flight booked successfully!', 'success');
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
