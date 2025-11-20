// js/main.js

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Global fetch wrapper to standardize API calls.
 * - Automatically adds Authorization header with JWT token.
 * - Handles JSON parsing.
 * - Intercepts 401/403 errors to log the user out.
 * @param {string} endpoint - The API endpoint (e.g., '/auth/login').
 * @param {string} method - The HTTP method (e.g., 'GET', 'POST').
 * @param {object|null} body - The request body for POST/PUT requests.
 * @returns {Promise<any>} - The JSON response from the API.
 */
async function api(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    // If token is invalid or expired, the server will respond with 401 or 403
    if (response.status === 401 || response.status === 403) {
        logout();
        throw new Error('Authorization failed. Please log in again.');
    }

    const data = await response.json();

    if (!response.ok) {
        // For other errors, throw an error with the message from the API
        throw new Error(data.message || 'An API error occurred.');
    }

    return data;
}

/**
 * Handles the logout process.
 */
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showAlert('You have been logged out.', 'info');
    // Redirect to login page after a short delay
    setTimeout(() => {
        // Avoid redirect loops if already on login page
        if (!window.location.pathname.endsWith('login.html')) {
            window.location.href = 'login.html';
        }
    }, 1500);
}


document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const dashboardLink = document.getElementById('dashboard-link');
    const logoutLink = document.getElementById('logout-link');

    if (user) {
        // User is logged in
        if(loginLink) loginLink.classList.add('d-none');
        if(registerLink) registerLink.classList.add('d-none');
        if(dashboardLink) dashboardLink.classList.remove('d-none');
        if(logoutLink) logoutLink.classList.remove('d-none');
    } else {
        // User is not logged in
        if(loginLink) loginLink.classList.remove('d-none');
        if(registerLink) registerLink.classList.remove('d-none');
        if(dashboardLink) dashboardLink.classList.add('d-none');
        if(logoutLink) logoutLink.classList.add('d-none');
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Navbar active state highlight
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.main-navbar .nav-link');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

/**
 * Displays a Bootstrap alert message in the alert container.
 * @param {string} message - The message to display.
 * @param {string} type - The alert type (e.g., 'success', 'danger', 'info').
 */
function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
        const alert = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        alertContainer.innerHTML = alert;

        // Automatically dismiss the alert after 5 seconds
        setTimeout(() => {
            const alertNode = alertContainer.querySelector('.alert');
            if (alertNode) {
                const bsAlert = bootstrap.Alert.getOrCreateInstance(alertNode);
                if (bsAlert) {
                    bsAlert.close();
                }
            }
        }, 5000);
    }
}