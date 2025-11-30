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
        <div class="col-md-12 mb-4" data-aos="fade-up">
            <div class="voyago-card p-4">
                <div class="row align-items-center">
                    <div class="col-md-5">
                        <div class="d-flex align-items-center mb-2">
                            <i class="bi bi-bus-front fs-3 text-primary-500 me-3"></i>
                            <div>
                                <h5 class="card-title mb-1">${bus.name}</h5>
                                <p class="text-muted small mb-0">
                                    <i class="bi bi-geo-alt-fill text-primary-500"></i> ${bus.from} 
                                    <i class="bi bi-arrow-right mx-2"></i> ${bus.to}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="d-flex gap-3 align-items-center">
                            <div class="text-center">
                                <p class="mb-0 fw-bold text-neutral-900 fs-5">${bus.departureTime}</p>
                                <small class="text-muted"><i class="bi bi-clock me-1"></i>Departure</small>
                            </div>
                            <i class="bi bi-arrow-right-circle text-primary-500"></i>
                            <div class="text-center">
                                <p class="mb-0 fw-bold text-neutral-900 fs-5">${bus.arrivalTime}</p>
                                <small class="text-muted"><i class="bi bi-clock me-1"></i>Arrival</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2 text-center my-3 my-md-0">
                        <span class="badge ${bus.seatsAvailable > 10 ? 'bg-success' : bus.seatsAvailable > 5 ? 'bg-warning' : 'bg-danger'} px-3 py-2">
                            <i class="bi bi-person-check-fill me-1"></i>${bus.seatsAvailable} Seats
                        </span>
                    </div>
                    <div class="col-md-2 text-end">
                        <div class="price-amount mb-2">₹${bus.price}</div>
                        <div class="d-flex align-items-center justify-content-end gap-2">
                            <input type="number" id="seats-${bus._id}" class="form-control form-control-sm" style="width: 60px;" value="1" min="1" max="${bus.seatsAvailable}">
                            <button class="btn btn-primary btn-sm" id="book-btn-${bus._id}" onclick="initiateBusBooking('${bus._id}')">
                                <i class="bi bi-ticket-perforated me-1"></i>Book
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    resultsContainer.innerHTML = `<h3 class="mb-4 text-primary-800">Available Buses</h3><div class="row">${busCards}</div>`;
}

/**
 * Initiates the bus booking process.
 * @param {string} busId - The ID of the bus to book.
 */
async function initiateBusBooking(busId) {
    const seatsInput = document.getElementById(`seats-${busId}`);
    const seats = parseInt(seatsInput.value);

    if (seats < 1) {
        showAlert('Please select at least 1 seat.', 'warning');
        return;
    }

    bookBus(busId, seats);
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

