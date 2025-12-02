// js/bus.js

document.addEventListener('DOMContentLoaded', () => {
    const busSearchForm = document.getElementById('bus-search-form');
    if (busSearchForm) {
        busSearchForm.addEventListener('submit', handleBusSearch);
    }

    // Payment button handler
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', handlePaymentSubmission);
    }

    // Load all buses initially
    loadAllBuses();
});

let pendingBooking = null;

/**
 * Loads all buses from the backend and renders them.
 */
async function loadAllBuses() {
    const resultsContainer = document.getElementById('bus-results');
    resultsContainer.innerHTML = `<div class="text-center mt-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading available buses...</p></div>`;

    try {
        const buses = await api('/bus');
        renderBusResults(buses);
    } catch (error) {
        console.error('Load buses error:', error);
        // If API fails (e.g. 404 if not implemented), we might want to keep static content or show error.
        // For now, let's show error but maybe we should have a fallback?
        // Assuming /bus endpoint exists as per previous context.
        resultsContainer.innerHTML = `<div class="alert alert-danger">Failed to load buses. Please try again later.</div>`;
    }
}

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

    const busCards = buses.map(bus => {
        // Calculate duration if not provided (dummy calculation for demo)
        const duration = "8h 30m"; 
        
        return `
        <div class="col-md-12 mb-4" data-aos="fade-up">
            <div class="voyago-card p-0 overflow-hidden border-0 shadow-sm hover-shadow-lg transition-all">
                <div class="card-body p-4">
                    <div class="row align-items-center g-4">
                        <!-- Operator Info -->
                        <div class="col-md-3 border-end-md">
                            <div class="d-flex align-items-center mb-2">
                                <div class="bg-primary-100 p-2 rounded-circle me-3 text-primary-600">
                                    <i class="bi bi-bus-front-fill fs-4"></i>
                                </div>
                                <div>
                                    <h5 class="fw-bold mb-1 text-neutral-900">${bus.name}</h5>
                                    <p class="text-muted small mb-0">AC Sleeper (2+1)</p>
                                </div>
                            </div>
                            <div class="d-flex align-items-center gap-2 mt-2">
                                <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2">
                                    <i class="bi bi-star-fill me-1"></i>4.5
                                </span>
                                <span class="text-muted small">1.2k Ratings</span>
                            </div>
                        </div>

                        <!-- Journey Timeline -->
                        <div class="col-md-5 border-end-md">
                            <div class="d-flex align-items-center justify-content-between px-md-3">
                                <div class="text-center">
                                    <p class="fs-4 fw-bold text-neutral-900 mb-0">${bus.departureTime}</p>
                                    <p class="text-muted small mb-0">${bus.from}</p>
                                </div>
                                
                                <div class="flex-grow-1 mx-3 text-center position-relative">
                                    <p class="text-muted small mb-1">${duration}</p>
                                    <div class="position-relative" style="height: 2px; background: #e5e7eb; margin-top: 8px;">
                                        <div class="position-absolute top-0 start-0 h-100 bg-primary-500" style="width: 100%;"></div>
                                        <div class="position-absolute top-50 start-0 translate-middle p-1 bg-white border border-primary-500 rounded-circle" style="width: 10px; height: 10px;"></div>
                                        <div class="position-absolute top-50 start-50 translate-middle p-1 bg-white border border-primary-500 rounded-circle" style="width: 10px; height: 10px;"></div>
                                        <div class="position-absolute top-50 start-100 translate-middle p-1 bg-white border border-primary-500 rounded-circle" style="width: 10px; height: 10px;"></div>
                                    </div>
                                </div>

                                <div class="text-center">
                                    <p class="fs-4 fw-bold text-neutral-900 mb-0">${bus.arrivalTime}</p>
                                    <p class="text-muted small mb-0">${bus.to}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Price & Actions -->
                        <div class="col-md-4">
                            <div class="d-flex flex-column align-items-md-end text-md-end">
                                <div class="mb-3">
                                    <p class="text-muted small mb-0">Starting from</p>
                                    <h3 class="fw-bold text-primary-600 mb-0">₹${bus.price}</h3>
                                </div>
                                
                                <div class="d-flex align-items-center gap-2 w-100 justify-content-md-end">
                                    <div class="d-flex flex-column align-items-end me-2">
                                        <small class="text-muted mb-1">Seats</small>
                                        <input type="number" id="seats-${bus._id}" class="form-control form-control-sm text-center" style="width: 60px;" value="1" min="1" max="${bus.seatsAvailable}">
                                    </div>
                                    <button class="btn btn-outline-primary btn-sm" onclick="viewBusDetails('${bus._id}')">
                                        Details
                                    </button>
                                    <button class="btn btn-primary btn-sm px-4" id="book-btn-${bus._id}" onclick="initiateBusBooking('${bus._id}')">
                                        Book
                                    </button>
                                </div>
                                <div class="mt-2">
                                    <small class="text-${bus.seatsAvailable < 10 ? 'danger' : 'success'} fw-medium">
                                        <i class="bi bi-people-fill me-1"></i>${bus.seatsAvailable} seats left
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer bg-soft border-top border-light py-2 px-4">
                    <div class="d-flex gap-4 overflow-auto">
                        <small class="text-muted"><i class="bi bi-shield-check me-1 text-success"></i>Safe & Sanitized</small>
                        <small class="text-muted"><i class="bi bi-geo-alt me-1 text-primary-500"></i>Live Tracking</small>
                        <small class="text-muted"><i class="bi bi-lightning-charge me-1 text-warning"></i>Charging Point</small>
                    </div>
                </div>
            </div>
        </div>
    `}).join('');

    resultsContainer.innerHTML = `<h3 class="mb-4 text-primary-800 fw-bold">Available Buses <span class="badge bg-primary-100 text-primary-600 fs-6 align-middle ms-2">${buses.length} Found</span></h3><div class="row">${busCards}</div>`;
}

/**
 * Displays the details of a bus in a modal.
 * @param {string} busId - The ID of the bus to view.
 */
async function viewBusDetails(busId) {
    // In a real app, we might fetch details from API if not already loaded.
    // For now, we'll find the bus in the rendered list or fetch it.
    // Since we don't have a global 'buses' list easily accessible without re-fetching or storing,
    // let's just fetch the specific bus or use dummy details for the modal as requested.
    
    // Let's try to find it from the DOM or just show dummy details + bus info if we can pass it.
    // To be clean, let's fetch it or use a global store. 
    // I'll implement a quick fetch or just show generic info for now to "do something".
    
    const content = document.getElementById('bus-details-content');
    content.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"></div></div>';
    
    const modal = new bootstrap.Modal(document.getElementById('busDetailsModal'));
    modal.show();

    try {
        // Ideally: const bus = await api(`/bus/${busId}`);
        // But let's simulate or use what we have.
        // If we can't fetch single, we can't show specific details easily.
        // Let's assume we can fetch or just show some static "Amenities" for now.
        
        content.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6 class="fw-bold">Amenities</h6>
                    <ul class="list-unstyled text-muted small">
                        <li><i class="bi bi-wifi me-2"></i>Free Wi-Fi</li>
                        <li><i class="bi bi-plug me-2"></i>Charging Points</li>
                        <li><i class="bi bi-snow me-2"></i>Air Conditioning</li>
                        <li><i class="bi bi-cup-hot me-2"></i>Water Bottle</li>
                        <li><i class="bi bi-tv me-2"></i>Personal TV</li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <h6 class="fw-bold">Boarding & Dropping</h6>
                    <ul class="list-unstyled text-muted small">
                        <li><strong class="text-dark">Boarding:</strong> Main Bus Stand, City Center</li>
                        <li><strong class="text-dark">Dropping:</strong> Inter-State Bus Terminal</li>
                    </ul>
                </div>
            </div>
            <div class="mt-3">
                <h6 class="fw-bold">Cancellation Policy</h6>
                <p class="text-muted small mb-0">
                    0-12 hrs before travel: 100% cancellation fee.<br>
                    12-24 hrs before travel: 50% cancellation fee.<br>
                    24+ hrs before travel: 10% cancellation fee.
                </p>
            </div>
        `;
    } catch (error) {
        content.innerHTML = '<div class="alert alert-danger">Failed to load details.</div>';
    }
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

    // Check if user is logged in before showing payment modal
    if (!localStorage.getItem('token')) {
        showAlert('You must be logged in to book a ticket.', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    // Store booking details
    pendingBooking = { busId, seats };

    // Show payment modal
    const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
    paymentModal.show();
}

/**
 * Handles the payment submission.
 */
async function handlePaymentSubmission() {
    if (!pendingBooking) return;

    const payBtn = document.getElementById('confirm-payment-btn');
    const originalText = payBtn.innerHTML;
    
    // Basic validation
    const cardHolder = document.getElementById('card-holder').value;
    const cardNumber = document.getElementById('card-number').value;
    const expiry = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;

    if (!cardHolder || !cardNumber || !expiry || !cvv) {
        alert('Please fill in all payment details.');
        return;
    }

    payBtn.disabled = true;
    payBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';

    // Simulate payment delay
    setTimeout(async () => {
        // Hide modal
        const paymentModalEl = document.getElementById('paymentModal');
        const paymentModal = bootstrap.Modal.getInstance(paymentModalEl);
        paymentModal.hide();

        // Reset button
        payBtn.disabled = false;
        payBtn.innerHTML = originalText;

        // Proceed with booking
        await bookBus(pendingBooking.busId, pendingBooking.seats);
        
        // Clear pending booking
        pendingBooking = null;
        
        // Reset form
        document.getElementById('payment-form').reset();
    }, 2000);
}

/**
 * Handles the booking of a bus.
 * @param {string} busId - The ID of the bus to book.
 * @param {number} seats - The number of seats to book.
 */
async function bookBus(busId, seats) {
    // User login check is already done in initiateBusBooking
    
    const bookButton = document.getElementById(`book-btn-${busId}`);
    if(bookButton) {
        bookButton.disabled = true;
        bookButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Booking...';
    }
    
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

