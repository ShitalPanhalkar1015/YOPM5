// js/hotel.js

document.addEventListener('DOMContentLoaded', () => {
    // Load all hotels initially
    loadAllHotels();

    const hotelSearchForm = document.getElementById('hotel-search-form');
    if (hotelSearchForm) {
        hotelSearchForm.addEventListener('submit', handleHotelSearch);
    }

    // Payment button handler
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', handlePaymentSubmission);
    }
});

let pendingBooking = null;

/**
 * Loads all hotels from the backend and renders them.
 */
async function loadAllHotels() {
    const resultsContainer = document.getElementById('hotel-results');
    try {
        const hotels = await api('/hotels');
        renderHotelResults(hotels);
    } catch (error) {
        console.error('Error loading hotels:', error);
        resultsContainer.innerHTML = `<div class="alert alert-danger">Failed to load hotels. Please try again later.</div>`;
    }
}

/**
 * Handles the hotel search form submission.
 * @param {Event} e - The form submission event.
 */
async function handleHotelSearch(e) {
    e.preventDefault();
    const city = document.getElementById('city').value;
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    const guests = document.getElementById('guests').value;
    
    // Advanced filters
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;
    const rating = document.getElementById('rating').value;
    const featured = document.getElementById('featured').checked;

    const resultsContainer = document.getElementById('hotel-results');
    const searchButton = e.target.querySelector('button[type="submit"]');

    if (!checkIn || !checkOut) {
        showAlert('Please select check-in and check-out dates.', 'warning');
        return;
    }

    // Store search criteria for booking
    const searchCriteria = { city, checkIn, checkOut, guests };
    sessionStorage.setItem('hotelSearchCriteria', JSON.stringify(searchCriteria));

    // Show loading state
    resultsContainer.innerHTML = `<div class="text-center mt-5 w-100"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Searching for hotels...</p></div>`;
    searchButton.disabled = true;

    try {
        let endpoint = `/hotels?`;
        if (city) endpoint += `city=${encodeURIComponent(city)}&`;
        if (minPrice) endpoint += `minPrice=${minPrice}&`;
        if (maxPrice) endpoint += `maxPrice=${maxPrice}&`;
        if (rating) endpoint += `rating=${rating}&`;
        if (featured) endpoint += `featured=true&`;

        const hotels = await api(endpoint);
        renderHotelResults(hotels, true);
    } catch (error) {
        console.error('Hotel search error:', error);
        showAlert(error.message, 'danger');
        resultsContainer.innerHTML = `<div class="alert alert-danger w-100">Failed to load hotel results. Please try again later.</div>`;
    } finally {
        searchButton.disabled = false;
    }
}

/**
 * Renders the hotel search results on the page.
 * @param {Array} hotels - An array of hotel objects.
 * @param {boolean} isSearch - Whether this is a search result or initial load.
 */
function renderHotelResults(hotels, isSearch = false) {
    const resultsContainer = document.getElementById('hotel-results');
    
    if (hotels.length === 0) {
        resultsContainer.innerHTML = '<div class="alert alert-info w-100">No hotels found matching your criteria.</div>';
        return;
    }

    const hotelCards = hotels.map(hotel => `
        <div class="col" data-aos="fade-up">
            <div class="voyago-card h-100">
                <div class="img-container">
                    <img src="${hotel.image || 'https://via.placeholder.com/400x300'}" 
                         class="card-img-top" 
                         alt="${hotel.name}" 
                         style="height: 220px; object-fit: cover; width: 100%;">
                    ${hotel.featured ? '<div class="position-absolute top-0 end-0 m-3"><span class="badge bg-primary"><i class="bi bi-star-fill me-1"></i>Featured</span></div>' : ''}
                </div>
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">${hotel.name}</h5>
                        ${hotel.rating ? `<span class="rating-badge"><i class="bi bi-star-fill"></i> ${hotel.rating}</span>` : ''}
                    </div>
                    
                    <div class="location-badge mb-2">
                        <i class="bi bi-geo-alt-fill text-primary-500"></i>
                        <span>${hotel.city}</span>
                    </div>
                    
                    <p class="card-text text-muted small flex-grow-1 mb-3">
                        ${hotel.description ? (hotel.description.length > 95 ? hotel.description.substring(0, 95) + '...' : hotel.description) : 'Experience luxury and comfort at this beautiful hotel.'}
                    </p>
                    
                    ${hotel.amenities && hotel.amenities.length > 0 ? `
                        <div class="mb-3 d-flex flex-wrap gap-1">
                            ${hotel.amenities.slice(0, 3).map(am => `<span class="amenity-badge"><i class="bi bi-check-circle-fill me-1"></i>${am}</span>`).join('')}
                            ${hotel.amenities.length > 3 ? `<span class="amenity-badge">+${hotel.amenities.length - 3} more</span>` : ''}
                        </div>
                    ` : ''}

                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-top pt-3">
                            <div>
                                <div class="price-amount">₹${hotel.pricePerNight.toLocaleString()}</div>
                                <small class="text-muted">per night</small>
                            </div>
                        </div>
                        <button class="btn btn-primary w-100" id="book-btn-${hotel._id}" onclick="initiateBooking('${hotel._id}')">
                            <i class="bi bi-calendar-check me-2"></i>Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    resultsContainer.innerHTML = hotelCards;
}

/**
 * Initiates the booking process.
 * @param {string} hotelId - The ID of the hotel to book.
 */
async function initiateBooking(hotelId) {
    if (!localStorage.getItem('token')) {
        showAlert('You must be logged in to book a hotel.', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    // Retrieve search criteria or prompt user
    let criteria = JSON.parse(sessionStorage.getItem('hotelSearchCriteria'));
    
    // Pre-fill modal fields if criteria exist, otherwise leave empty for user to fill
    const modalCheckIn = document.getElementById('modal-check-in');
    const modalCheckOut = document.getElementById('modal-check-out');
    const modalGuests = document.getElementById('modal-guests');

    if (criteria && criteria.checkIn && criteria.checkOut) {
        modalCheckIn.value = criteria.checkIn;
        modalCheckOut.value = criteria.checkOut;
        modalGuests.value = criteria.guests || 1;
        // Optional: Make them read-only if we want to force search, but user asked to "add date", so editable is better.
    } else {
        // Try to get from search form if present
        const searchCheckIn = document.getElementById('check-in').value;
        const searchCheckOut = document.getElementById('check-out').value;
        const searchGuests = document.getElementById('guests').value;
        
        if (searchCheckIn) modalCheckIn.value = searchCheckIn;
        if (searchCheckOut) modalCheckOut.value = searchCheckOut;
        if (searchGuests) modalGuests.value = searchGuests;
    }

    // Store booking details (criteria might be incomplete, will be updated in handlePaymentSubmission)
    pendingBooking = { 
        hotelId, 
        criteria: criteria || {} 
    };

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
    const checkIn = document.getElementById('modal-check-in').value;
    const checkOut = document.getElementById('modal-check-out').value;
    const guests = document.getElementById('modal-guests').value;
    
    const cardHolder = document.getElementById('card-holder').value;
    const cardNumber = document.getElementById('card-number').value;
    const expiry = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;

    if (!checkIn || !checkOut || !guests) {
        alert('Please fill in check-in, check-out dates and guests.');
        return;
    }

    if (!cardHolder || !cardNumber || !expiry || !cvv) {
        alert('Please fill in all payment details.');
        return;
    }
    
    // Update pending booking criteria with modal values
    pendingBooking.criteria = {
        checkIn,
        checkOut,
        guests
    };

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
        await bookHotel(pendingBooking.hotelId, pendingBooking.criteria);
        
        // Clear pending booking
        pendingBooking = null;
        
        // Reset form
        document.getElementById('payment-form').reset();
    }, 2000);
}

/**
 * Performs the actual hotel booking API call.
 */
async function bookHotel(hotelId, criteria) {
    const bookButton = document.getElementById(`book-btn-${hotelId}`);
    const originalText = bookButton ? bookButton.innerHTML : 'Book Now';
    
    if (bookButton) {
        bookButton.disabled = true;
        bookButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Booking...';
    }

    try {
        const payload = {
            hotelId,
            checkIn: criteria.checkIn,
            checkOut: criteria.checkOut,
            guests: criteria.guests
        };

        const result = await api('/hotels/book', 'POST', payload);
        showAlert('Hotel booked successfully! Check your dashboard.', 'success');
        console.log('Booking successful:', result);
        
        // Optional: Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);

    } catch (error) {
        console.error('Booking error:', error);
        showAlert(error.message, 'danger');
    } finally {
        if (bookButton) {
            bookButton.disabled = false;
            bookButton.innerHTML = originalText;
        }
    }
}

