document.addEventListener('DOMContentLoaded', () => {
  const f = document.getElementById('hotelSearch');
  if (!f) return;
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = document.getElementById('city').value.trim();
    try {
      const res = await fetch(`http://localhost:5000/api/hotels?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (!res.ok) { showAlert(data.message || 'Error', 'danger'); return; }
      renderHotels(Array.isArray(data) ? data : []);
    } catch (err) {
      showAlert(err.message, 'danger');
    }
  });
});

function renderHotels(list) {
  const c = document.getElementById('hotelResults');
  if (!c) return;
  if (!list.length) { c.innerHTML = '<div class="col-12"><div class="alert alert-info">No hotels found.</div></div>'; return; }
  c.innerHTML = list.map(h => `
    <div class="col-md-4">
      <div class="card h-100 shadow-sm">
        <img src="https://source.unsplash.com/800x600/?hotel" class="card-img-top" alt="hotel">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${h.name || 'Hotel'}</h5>
          <p class="mb-1">City: ${h.city || ''}</p>
          <p class="mb-1">Price/night: $${h.pricePerNight || 0}</p>
          <div class="mt-auto">
            <button class="btn btn-primary w-100" onclick="onBookHotel('${h._id}')">Book</button>
          </div>
        </div>
      </div>
    </div>`).join('');
}

async function onBookHotel(id) {
  const token = getToken();
  if (!token) { showAlert('Please login to book', 'warning'); window.location = '/login.html'; return; }
  const checkIn = document.getElementById('checkin').value || prompt('Check-in (YYYY-MM-DD):');
  const checkOut = document.getElementById('checkout').value || prompt('Check-out (YYYY-MM-DD):');
  const guests = document.getElementById('guests').value || prompt('Guests:');
  try {
    const res = await fetch(`http://localhost:5000/api/hotels/${id}/book`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization':'Bearer ' + token },
      body: JSON.stringify({ hotelId: id, checkIn, checkOut, guests })
    });
    const data = await res.json();
    if (res.ok) showAlert('Hotel booked', 'success'); else showAlert(data.message || 'Booking failed', 'danger');
  } catch (err) { showAlert(err.message, 'danger'); }
}
