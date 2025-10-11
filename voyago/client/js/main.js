const API = {
  get: (url) => fetch(url),
  getAuth: (url) => fetch(url, { headers: { Authorization: 'Bearer ' + localStorage.getItem('voyago_token') } }),
  post: (url, body) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  postAuth: (url, body) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('voyago_token') }, body: JSON.stringify(body) })
};

async function loadAndRender(selector, endpoint, renderItem) {
  const res = await API.get(endpoint);
  const items = await res.json();
  const el = document.querySelector(selector);
  if (!el) return;
  el.innerHTML = items.map(renderItem).join('');
}

function money(n){ return '$'+(n||0); }

// Example for bus page usage:
// loadAndRender('#busList','/api/buses', b => `<div class="card mb-2 p-2"><h5>${b.name} (${b.from} → ${b.to})</h5><p>${money(b.price)}</p><button onclick="bookBus('${b._id}')">Book</button></div>`);

async function bookBus(busId, seats){
  // seats: array of seat numbers
  const res = await API.postAuth(`/api/buses/${busId}/book`, { seats });
  return res.json();
}

async function bookCab(cabId, origin, destination, distanceKm){
  const res = await API.postAuth(`/api/cabs/${cabId}/book`, { cabId, origin, destination, distanceKm });
  return res.json();
}

async function estimateCab(cabId, distanceKm){
  const res = await API.post('/api/cabs/estimate', { cabId, distanceKm });
  return res.json();
}

async function bookHotel(hotelId, checkIn, checkOut, guests){
  const res = await API.postAuth(`/api/hotels/${hotelId}/book`, { hotelId, checkIn, checkOut, guests });
  return res.json();
}

async function bookPackage(pkgId){
  const res = await API.postAuth(`/api/packages/${pkgId}/book`, {});
  return res.json();
}

// small helper to fetch current user (used by dashboard)
async function currentUser(){
  const token = localStorage.getItem('voyago_token');
  if (!token) return null;
  const res = await API.getAuth('/api/auth/me');
  if (res.status === 200) return res.json();
  return null;
}

// Global helpers and navbar/auth state
function showAlert(message, type = 'success', timeout = 4000) {
  const p = document.getElementById('alert-placeholder');
  if (!p) return;
  p.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  </div>`;
  if (timeout) setTimeout(()=> { if (p) p.innerHTML = ''; }, timeout);
}

function setLoggedIn(user, token) {
  if (token) localStorage.setItem('voyago_token', token);
  if (user) localStorage.setItem('voyago_user', JSON.stringify(user));
  updateNav();
}

function logout() {
  localStorage.removeItem('voyago_token');
  localStorage.removeItem('voyago_user');
  updateNav();
  window.location = '/';
}

function getToken() { return localStorage.getItem('voyago_token'); }
function getUser() { const u = localStorage.getItem('voyago_user'); return u ? JSON.parse(u) : null; }

function requireAuth(redirectTo = '/login.html') {
  if (!getToken()) {
    window.location = redirectTo;
    return false;
  }
  return true;
}

function updateNav() {
  const user = getUser();
  const login = document.getElementById('nav-login');
  const register = document.getElementById('nav-register');
  const dash = document.getElementById('nav-dashboard');
  if (user) {
    if (login) login.classList.add('d-none');
    if (register) register.classList.add('d-none');
    if (dash) dash.classList.remove('d-none');
  } else {
    if (login) login.classList.remove('d-none');
    if (register) register.classList.remove('d-none');
    if (dash) dash.classList.add('d-none');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateNav();
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', () => { logout(); });
});