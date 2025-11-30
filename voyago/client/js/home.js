// js/home.js

document.addEventListener('DOMContentLoaded', () => {
    loadPopularDestinations();
});

/**
 * Loads popular destinations (featured hotels) from the backend.
 */
async function loadPopularDestinations() {
    const destinationsContainer = document.getElementById('destination-cards-container');
    if (!destinationsContainer) return;

    try {
        // Fetch featured hotels
        const hotels = await api('/hotels?featured=true');
        
        // Take only the top 3
        const featuredHotels = hotels.slice(0, 3);

        if (featuredHotels.length === 0) {
            destinationsContainer.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No popular destinations available at the moment.</p></div>';
            return;
        }

        const hotelCards = featuredHotels.map((hotel, index) => `
            <div class="col" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="voyago-card h-100">
                    <div class="img-container">
                        <img src="${hotel.image || 'https://via.placeholder.com/400x300'}" 
                             class="card-img-top" 
                             alt="${hotel.name}" 
                             style="height: 240px; object-fit: cover; width: 100%;">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title mb-0">${hotel.name}</h5>
                            ${hotel.rating ? `<span class="rating-badge"><i class="bi bi-star-fill"></i> ${hotel.rating}</span>` : ''}
                        </div>
                        
                        <div class="location-badge mb-2">
                            <i class="bi bi-geo-alt-fill text-primary-500"></i>
                            <span>${hotel.city}, India</span>
                        </div>
                        
                        <p class="card-text text-muted small flex-grow-1 mb-3">
                            ${hotel.description ? (hotel.description.length > 85 ? hotel.description.substring(0, 85) + '...' : hotel.description) : 'Experience luxury and comfort at this beautiful destination.'}
                        </p>
                        
                        <div class="mt-auto">
                            <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-top pt-3">
                                <div>
                                    <div class="price-amount">₹${hotel.pricePerNight ? hotel.pricePerNight.toLocaleString() : 'N/A'}</div>
                                    <small class="text-muted">per night</small>
                                </div>
                            </div>
                            <a href="hotel.html" class="btn btn-primary w-100">
                                <i class="bi bi-search me-2"></i>View Details
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        destinationsContainer.innerHTML = hotelCards;

    } catch (error) {
        console.error('Error loading popular destinations:', error);
        destinationsContainer.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Failed to load destinations.</p></div>';
    }
}
