document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return;
  const user = getUser();
  if (!user || !user.id && !user._id) {
    showAlert('User not found', 'danger');
    return;
  }
  const uid = user.id || user._id;
  try {
    const res = await fetch(`http://localhost:5000/api/bookings/user/${uid}`, {
      headers: { Authorization: 'Bearer ' + getToken() }
    });
    const data = await res.json();
    if (!res.ok) { showAlert(data.message || 'Could not load bookings', 'danger'); return; }
    renderBookings(data.bookings || data || []);
  } catch (err) { showAlert(err.message, 'danger'); }
});

function renderBookings(list) {
  const c = document.getElementById('bookingsContainer');
  if (!c) return;
  if (!list.length) { c.innerHTML = '<div class="alert alert-info">You have no bookings yet.</div>'; return; }
  // group by kind
  const groups = list.reduce((acc, b) => { (acc[b.kind] = acc[b.kind]||[]).push(b); return acc; }, {});
  c.innerHTML = Object.keys(groups).map(kind => `
    <section class="mb-4">
      <h5 class="mb-2 text-capitalize">${kind}</h5>
      <div class="row g-2">
        ${groups[kind].map(b => `
          <div class="col-md-4">
            <div class="card shadow-sm">
              <div class="card-body">
                <p class="mb-1"><strong>ID:</strong> ${b._id || ''}</p>
                <p class="mb-1"><strong>Details:</strong> ${JSON.stringify(b.details || {})}</p>
                <p class="mb-1"><small class="text-muted">Booked: ${new Date(b.bookedAt || b.createdAt || Date.now()).toLocaleString()}</small></p>
              </div>
            </div>
          </div>`).join('')}
      </div>
    </section>`).join('');
}
