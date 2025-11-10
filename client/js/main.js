// client/js/main.js

console.log('Welcome to the Trip Planner client-side application!');

/**
 * Example of how to fetch data from a protected route.
 * The browser will automatically send the HttpOnly cookie with the request
 * because of the `credentials: 'include'` option.
 */
const fetchTrips = async () => {
  try {
    const res = await fetch('/api/trips', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // This is crucial for sending cookies
    });

    if (res.ok) {
      const data = await res.json();
      console.log('Successfully fetched trips:', data);
      // Here you would typically render the trips to the UI
    } else {
      console.error('Failed to fetch trips. You may not be logged in.');
    }
  } catch (error) {
    console.error('An error occurred while fetching trips:', error);
  }
};

/**
 * Example of a login function. After a successful login, the server
 * will set the HttpOnly cookie in the browser.
 */
const login = async (email, password) => {
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            console.log('Login successful!');
            // After logging in, you can now fetch data from protected routes
            fetchTrips();
        } else {
            console.error('Login failed.');
        }
    } catch (error) {
        console.error('An error occurred during login:', error);
    }
};

// To test, you could call the login function.
// Make sure you have a user in your database (e.g., by running the seeder).
// login('john@example.com', 'password123');
