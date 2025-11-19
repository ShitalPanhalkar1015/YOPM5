// js/package.js

document.addEventListener('DOMContentLoaded', () => {
    fetchPackages();
});

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
function renderPackages(packages) {
    const packagesContainer = document.getElementById('packages-container');
    if (packages.length === 0) {
        packagesContainer.innerHTML = '<div class="alert alert-info">No travel packages are available at the moment.</div>';
        return;
    }

    const packageCards = packages.map(pkg => `
        <div class="col-md-4 mb-4">
            <div class="card h-100 shadow-sm">
                <img src="${pkg.image || 'https://via.placeholder.com/400x250'}" class="card-img-top" alt="${pkg.destination}" style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${pkg.destination}</h5>
                    <p class="card-text">${pkg.description}</p>
                    <div class="mt-auto">
                        <p class="text-primary fw-bold fs-5 mb-2">₹${pkg.price}</p>
                        <button class="btn btn-primary w-100" id="book-btn-${pkg._id}" onclick="bookPackage('${pkg._id}')">Book Now</button>
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
async function bookPackage(packageId) {
    if (!localStorage.getItem('token')) {
        showAlert('You must be logged in to book a package.', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    const bookButton = document.getElementById(`book-btn-${packageId}`);
    bookButton.disabled = true;
    bookButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Booking...';

    try {
        const result = await api('/packages/book', 'POST', { packageId });
        showAlert('Package booked successfully!', 'success');
        console.log('Booking successful:', result);
    } catch (error) {
        console.error('Booking error:', error);
        showAlert(error.message, 'danger');
    } finally {
        bookButton.disabled = false;
        bookButton.innerHTML = 'Book Now';
    }
}
