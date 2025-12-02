// js/package.js

document.addEventListener('DOMContentLoaded', () => {
    fetchPackages();

    // Payment button handler
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', handlePaymentSubmission);
    }
});

let pendingBooking = null;

/**
 * Fetches travel packages from the API and renders them.
 */
async function fetchPackages() {
    const packagesContainer = document.getElementById('packages-container');
    
    // Show loading state
    packagesContainer.innerHTML = `<div class="text-center mt-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading travel packages...</p></div>`;

    try {
        const packages = await api('/packages');
        renderPackages(packages);
    } catch (error) {
        console.error('Fetch packages error:', error);
        showAlert(error.message, 'danger');
        packagesContainer.innerHTML = `<div class="alert alert-danger">Failed to load travel packages. Please try again later.</div>`;
    }
}

/**
 * Renders the travel packages on the page.
 * @param {Array} packages - An array of package objects.
 */
/**
 * Renders the travel packages on the page.
 * @param {Array} packages - An array of package objects.
 */
function renderPackages(packages) {
    const packagesContainer = document.getElementById('packages-container');
    if (packages.length === 0) {
        packagesContainer.innerHTML = '<div class="alert alert-info w-100">No travel packages are available at the moment.</div>';
        return;
    }

    const packageCards = packages.map(pkg => `
        <div class="col" data-aos="fade-up">
            <div class="voyago-card h-100">
                <div class="img-container">
                    <img src="${pkg.image || 'https://via.placeholder.com/400x300'}" 
                         class="card-img-top" 
                         alt="${pkg.destination}" 
                         style="height: 240px; object-fit: cover; width: 100%;">
                </div>
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">${pkg.destination}</h5>
                        ${pkg.rating ? `<span class="rating-badge"><i class="bi bi-star-fill"></i> ${pkg.rating}</span>` : ''}
                    </div>
                    
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <span class="badge bg-primary-soft text-primary-700" style="background-color: var(--primary-100); color: var(--primary-700);">
                            <i class="bi bi-clock me-1"></i>${pkg.duration}
                        </span>
                    </div>
                    
                    <p class="card-text text-muted small flex-grow-1 mb-3">
                        ${pkg.description ? (pkg.description.length > 100 ? pkg.description.substring(0, 100) + '...' : pkg.description) : 'Discover amazing experiences and create unforgettable memories.'}
                    </p>
                    
                    ${pkg.activities && pkg.activities.length > 0 ? `
                        <div class="mb-3 d-flex flex-wrap gap-1">
                            ${pkg.activities.slice(0, 3).map(act => `<span class="amenity-badge"><i class="bi bi-check-circle-fill me-1"></i>${act}</span>`).join('')}
                            ${pkg.activities.length > 3 ? `<span class="amenity-badge">+${pkg.activities.length - 3} more</span>` : ''}
                        </div>
                    ` : ''}

                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-top pt-3">
                            <div>
                                <div class="price-amount">₹${pkg.price.toLocaleString()}</div>
                                <small class="text-muted">per person</small>
                            </div>
                        </div>
                        <button class="btn btn-primary w-100" id="book-btn-${pkg._id}" onclick="initiatePackageBooking('${pkg._id}')">
                            <i class="bi bi-calendar-check me-2"></i>Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    packagesContainer.innerHTML = packageCards;
}

/**
 * Handles the booking of a travel package.
 * @param {string} packageId - The ID of the package to book.
 */
/**
 * Initiates the package booking process.
 * @param {string} packageId - The ID of the package to book.
 */
async function initiatePackageBooking(packageId) {
    if (!localStorage.getItem('token')) {
        showAlert('You must be logged in to book a package.', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    // Store booking details
    pendingBooking = { packageId };

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
    const travelDate = document.getElementById('travel-date').value;
    const travelers = document.getElementById('travelers').value;
    const cardHolder = document.getElementById('card-holder').value;
    const cardNumber = document.getElementById('card-number').value;
    const expiry = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;

    if (!travelDate || !travelers) {
        alert('Please select travel date and number of travelers.');
        return;
    }

    if (!cardHolder || !cardNumber || !expiry || !cvv) {
        alert('Please fill in all payment details.');
        return;
    }

    // Update pending booking with user inputs
    pendingBooking.date = travelDate;
    pendingBooking.travelers = travelers;

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
        await processPackageBooking(pendingBooking.packageId);
        
        // Clear pending booking
        pendingBooking = null;
        
        // Reset form
        document.getElementById('payment-form').reset();
    }, 2000);
}

/**
 * Processes the actual package booking API call.
 * @param {string} packageId - The ID of the package to book.
 */
async function processPackageBooking(packageId) {
    const bookButton = document.getElementById(`book-btn-${packageId}`);
    if (bookButton) {
        bookButton.disabled = true;
        bookButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Booking...';
    }

    try {
        // Include date and travelers in the payload
        const payload = { 
            packageId,
            date: pendingBooking.date,
            travelers: pendingBooking.travelers
        };
        const result = await api('/packages/book', 'POST', payload);
        showAlert('Package booked successfully!', 'success');
        console.log('Booking successful:', result);
    } catch (error) {
        console.error('Booking error:', error);
        showAlert(error.message, 'danger');
    } finally {
        if (bookButton) {
            bookButton.disabled = false;
            bookButton.innerHTML = 'Book Now';
        }
    }
}
