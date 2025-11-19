// js/hotel.js

document.addEventListener('DOMContentLoaded', () => {
    const hotelSearchForm = document.getElementById('hotel-search-form');
    if (hotelSearchForm) {
        hotelSearchForm.addEventListener('submit', handleHotelSearch);
    }
});

/**
 * Handles the hotel search form submission.
 * @param {Event} e - The form submission event.
 */
async function handleHotelSearch(e) {
    e.preventDefault();
    const city = document.getElementById('city').value;
    const resultsContainer = document.getElementById('hotel-results');
    const searchButton = e.target.querySelector('button[type="submit"]');

    if (!city) {
        showAlert('Please enter a city to search for hotels.', 'warning');
        return;
    }

    // Show loading state
    resultsContainer.innerHTML = `<div class="text-center mt-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Searching for hotels...</p></div>`;
    searchButton.disabled = true;

    try {
        const endpoint = `/hotels?city=${encodeURIComponent(city)}`;
        const hotels = await api(endpoint);
        renderHotelResults(hotels);
    } catch (error) {
        console.error('Hotel search error:', error);
        showAlert(error.message, 'danger');
        resultsContainer.innerHTML = `<div class="alert alert-danger">Failed to load hotel results. Please try again later.</div>`;
    } finally {
        searchButton.disabled = false;
    }
}

/**
 * Renders the hotel search results on the page.
 * @param {Array} hotels - An array of hotel objects.
 */
function renderHotelResults(hotels) {
    const resultsContainer = document.getElementById('hotel-results');
    if (hotels.length === 0) {
        resultsContainer.innerHTML = '<div class="alert alert-info">No hotels found for the selected city.</div>';
        return;
    }

    const hotelCards = hotels.map(hotel => `
        <div class="col-md-4 mb-4">
            <div class="card h-100 shadow-sm">
                <img src="${hotel.image || 'https://via.placeholder.com/400x250'}" class="card-img-top" alt="${hotel.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${hotel.name}</h5>
                    <p class="card-text text-muted">${hotel.city}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <p class="text-primary fw-bold mb-0">₹${hotel.pricePerNight}/night</p>
                        <span class="badge bg-success">${'⭐'.repeat(Math.round(hotel.rating))}</span>
                    </div>
                    <button class="btn btn-primary mt-3" id="book-btn-${hotel._id}" onclick="bookHotel('${hotel._id}', 2)">Book Now</button>
                </div>
            </div>
        </div>
    `).join('');

    resultsContainer.innerHTML = `<h3 class="mb-4">Hotels in ${hotels[0].city}</h3><div class="row">${hotelCards}</div>`;
}

/**
 * Handles the booking of a hotel.
 * @param {string} hotelId - The ID of the hotel to book.
 * @param {number} nights - The number of nights to book.
 */
async function bookHotel(hotelId, nights) {
    if (!localStorage.getItem('token')) {
        showAlert('You must be logged in to book a hotel.', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    const bookButton = document.getElementById(`book-btn-${hotelId}`);
    bookButton.disabled = true;
    bookButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Booking...';

    try {
        const result = await api('/hotels/book', 'POST', { hotelId, nights });
        showAlert('Hotel booked successfully!', 'success');
        console.log('Booking successful:', result);
    } catch (error) {
        console.error('Booking error:', error);
        showAlert(error.message, 'danger');
    } finally {
        bookButton.disabled = false;
        bookButton.innerHTML = 'Book Now';
    }
}

