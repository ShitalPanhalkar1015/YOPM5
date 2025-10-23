document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/packages');
    const data = await res.json();
    if (!res.ok) { showAlert(data.message || 'Unable to load packages', 'danger'); return; }
    renderPackages(Array.isArray(data) ? data : []);
  } catch (err) {
    showAlert(err.message, 'danger');
  }
});

function renderPackages(list) {
  const c = document.getElementById('packageList');
  if (!c) return;
  if (!list.length) { c.innerHTML = '<div class="alert alert-info">No packages available.</div>'; return; }
  c.innerHTML = list.map(p => `
    <div class="col-md-4">
      <div class="card h-100 shadow-sm">
        <img src="https://source.unsplash.com/800x600/?${encodeURIComponent(p.destination||'travel')}" class="card-img-top" alt="pkg">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.title || p.destination}</h5>
          <p class="card-text text-truncate">${p.details || p.description || ''}</p>
          <p class="mb-2"><strong>$${p.price || 0}</strong></p>
          <div class="mt-auto"><button class="btn btn-primary w-100" onclick="onBookPackage('${p._id}')">Book Now</button></div>
        </div>
      </div>
    </div>`).join('');
}

async function onBookPackage(id) {
  const token = getToken();
  if (!token) { showAlert('Please login to book', 'warning'); window.location = '/login.html'; return; }
  try {
    const res = await fetch(`/api/packages/${id}/book`, {
      method: 'POST', headers: { Authorization: 'Bearer ' + token }
    });
    const data = await res.json();
    if (res.ok) showAlert('Package booked', 'success'); else showAlert(data.message || 'Booking failed', 'danger');
  } catch (err) { showAlert(err.message, 'danger'); }
}
