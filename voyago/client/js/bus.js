document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('searchForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const from = document.getElementById('from').value.trim();
    const to = document.getElementById('to').value.trim();
    const date = document.getElementById('date').value;
    const q = new URLSearchParams({ from, to, date });
    try {
      const res = await fetch(`/api/buses?${q.toString()}`);
      const data = await res.json();
      if (!res.ok) { showAlert(data.message || 'No buses', 'warning'); return; }
      renderResults(Array.isArray(data) ? data : []);
    } catch (err) {
      showAlert(err.message, 'danger');
    }
  });
});

function renderResults(list) {
  const container = document.getElementById('results');
  if (!container) return;
  if (!list.length) {
    container.innerHTML = '<div class="col-12"><div class="alert alert-info">No buses found.</div></div>';
    return;
  }
  container.innerHTML = list.map(b => `
    <div class="col-md-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${b.name || 'Bus'}</h5>
          <p class="mb-1">${b.from || ''} → ${b.to || ''}</p>
          <p class="mb-1">Date: ${b.date ? new Date(b.date).toLocaleString() : 'TBD'}</p>
          <p class="mb-1">Price: $${b.price || 0}</p>
          <p class="mb-1">Seats: ${b.seatsAvailable ? b.seatsAvailable.length : (b.seats || '—')}</p>
          <div class="mt-auto">
            <button class="btn btn-primary w-100" onclick="onBookBus('${b._id}')">Book Now</button>
          </div>
        </div>
      </div>
    </div>`).join('');
}

async function onBookBus(id) {
  const token = getToken();
  if (!token) { showAlert('Please login to book', 'warning'); window.location = '/login.html'; return; }
  const seatsStr = prompt('Enter seat numbers to book (comma separated): e.g. 1,2');
  if (!seatsStr) return;
  const seats = seatsStr.split(',').map(s => parseInt(s.trim())).filter(Boolean);
  try {
    const res = await fetch(`/api/buses/${id}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ seats })
    });
    const data = await res.json();
    if (res.ok) {
      showAlert('Bus booked successfully', 'success');
    } else {
      showAlert(data.message || 'Booking failed', 'danger');
    }
  } catch (err) {
    showAlert(err.message, 'danger');
  }
}
