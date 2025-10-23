// Handles login and register pages
const API_BASE = '/api';

async function postJson(url, body) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 0, data: { message: err.message } };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const res = await postJson(`${API_BASE}/auth/login`, { email, password });
      if (res.ok && res.data.token) {
        setLoggedIn(res.data.user || { email }, res.data.token);
        showAlert('Login successful', 'success', 2000);
        window.location = '/dashboard.html';
      } else {
        showAlert(res.data.message || 'Login failed', 'danger');
      }
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const res = await postJson(`${API_BASE}/auth/register`, { name, email, password });
      if (res.ok && res.data.token) {
        setLoggedIn(res.data.user || { name, email }, res.data.token);
        showAlert('Registration successful', 'success', 2000);
        window.location = '/dashboard.html';
      } else {
        showAlert(res.data.message || 'Registration failed', 'danger');
      }
    });
  }
});
