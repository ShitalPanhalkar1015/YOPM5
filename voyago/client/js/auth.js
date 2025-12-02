// js/auth.js

/**
 * This script handles authentication-related functionality.
 * - It attaches event listeners to the login and register forms.
 * - It uses the global `api` function to send requests to the backend.
 * - On successful login, it stores the JWT and user object in localStorage.
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

/**
 * Handles the login form submission.
 * @param {Event} e - The form submission event.
 */
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginButton = e.target.querySelector('button[type="submit"]');

    // Disable button and show spinner
    loginButton.disabled = true;
    loginButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging In...';

    try {
        const data = await api('/auth/login', 'POST', { email, password });

        // Backend returns { userId, name, email, token }
        // We will store the token and the user object separately
        localStorage.setItem('token', data.token);
        const user = { _id: data.userId, name: data.name, email: data.email };
        localStorage.setItem('user', JSON.stringify(user));

        showAlert('Login successful! Redirecting to your dashboard...', 'success');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);

    } catch (error) {
        console.error('Login error:', error);
        showAlert(error.message, 'danger');
        // Re-enable button on failure
        loginButton.disabled = false;
        loginButton.innerHTML = 'Login';
    }
}

/**
 * Handles the registration form submission.
 * @param {Event} e - The form submission event.
 */
async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const registerButton = e.target.querySelector('button[type="submit"]');

    // Disable button and show spinner
    registerButton.disabled = true;
    registerButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registering...';

    try {
        await api('/auth/register', 'POST', { name, email, password });

        showAlert('Registration successful! Please log in.', 'success');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

    } catch (error) {
        console.error('Registration error:', error);
        showAlert(error.message, 'danger');
        // Re-enable button on failure
        registerButton.disabled = false;
        registerButton.innerHTML = 'Register';
    }
}

