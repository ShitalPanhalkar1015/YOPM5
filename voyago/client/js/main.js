const API = {
  // Accepts either absolute or path starting with /
  _fetch: (url, opts) => {
    const finalUrl = url.startsWith('http') ? url : (window.location.origin + url);
    return fetch(finalUrl, opts);
  },
  get: (url) => API._fetch(url),
  getAuth: (url) => {
    const token = localStorage.getItem('voyago_token');
    if (!token) return Promise.resolve(new Response(null, { status: 401 }));
    return API._fetch(url, { headers: { Authorization: 'Bearer ' + token } });
  },
  post: (url, body) => API._fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  postAuth: (url, body) => {
    const token = localStorage.getItem('voyago_token');
    if (!token) return Promise.resolve(new Response(JSON.stringify({ message: 'No token' }), { status: 401 }));
    return API._fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(body) });
  }
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
  try {
    const res = await API.getAuth('/api/auth/me');
    if (res.status === 200) {
      const u = await res.json();
      // store fresh user snapshot
      localStorage.setItem('voyago_user', JSON.stringify(u));
      return u;
    }
    if (res.status === 401) { logout(); return null; }
    return null;
  } catch (err) { return null; }
}

// Toast helper: non-blocking bootstrap-style toast using small DOM container
function ensureToastContainer() {
  let c = document.getElementById('toastContainer');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toastContainer';
    c.className = 'position-fixed top-0 end-0 p-3';
    c.style.zIndex = 1080;
    document.body.appendChild(c);
  }
  return c;
}

function showToast(message, type = 'success', ttl = 3500) {
  const c = ensureToastContainer();
  const id = 't' + Date.now();
  const bg = type === 'danger' ? 'bg-danger text-white' : type === 'warning' ? 'bg-warning text-dark' : 'bg-success text-white';
  const toast = document.createElement('div');
  toast.id = id;
  toast.className = `toast align-items-center ${bg} border-0 mb-2`;
  toast.role = 'alert';
  toast.innerHTML = `<div class="d-flex">
    <div class="toast-body small">${message}</div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close"></button>
  </div>`;
  c.appendChild(toast);
  toast.querySelector('.btn-close').addEventListener('click', () => toast.remove());
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, ttl);
  return toast;
}

// Backwards compatible: if code calls showAlert keep behaviour but delegate to toast if alert-placeholder absent
function showAlert(message, type = 'success', timeout = 4000) {
  const p = document.getElementById('alert-placeholder');
  if (!p) return showToast(message, type, timeout);
  p.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  </div>`;
  if (timeout) setTimeout(()=> { if (p) p.innerHTML = ''; }, timeout);
}

// create a small avatar (initials) for user display
function userInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).slice(0,2);
  return parts.map(p => p[0]?.toUpperCase() || '').join('');
}

function buildUserMenu(user) {
  const name = user.name || user.email || 'User';
  const initials = userInitials(name);
  return `
    <li id="nav-user" class="nav-item dropdown">
      <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <div class="avatar me-2">${initials}</div>
        <span class="d-none d-lg-inline">${name.split(' ')[0]}</span>
      </a>
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
        <li><a class="dropdown-item" href="dashboard.html"><i class="bi bi-speedometer2 me-2"></i>Dashboard</a></li>
        <li><a class="dropdown-item" href="profile.html"><i class="bi bi-person me-2"></i>Profile</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a id="nav-logout" class="dropdown-item text-danger" href="#"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
      </ul>
    </li>
  `;
}

function updateNav() {
  const user = getUser();
  const login = document.getElementById('nav-login');
  const register = document.getElementById('nav-register');
  const dash = document.getElementById('nav-dashboard');
  const navUserHolder = document.getElementById('nav-user-placeholder');

  if (user) {
    if (login) login.classList.add('d-none');
    if (register) register.classList.add('d-none');
    if (dash) dash.classList.remove('d-none');

    // render user menu into placeholder if present
    if (navUserHolder) {
      navUserHolder.innerHTML = buildUserMenu(user);
      const logoutLink = document.getElementById('nav-logout');
      if (logoutLink) logoutLink.addEventListener('click', (e) => { e.preventDefault(); logout(); });
    }
  } else {
    if (login) login.classList.remove('d-none');
    if (register) register.classList.remove('d-none');
    if (dash) dash.classList.add('d-none');
    if (navUserHolder) navUserHolder.innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateNav();
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', () => { logout(); });
});