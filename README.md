# 🌍 Voyago - Modern Travel Booking Platform

A full-stack travel booking application built with **Express.js**, **MongoDB**, and **Vanilla JavaScript**. Book buses, flights, hotels, and travel packages all in one place!

## ✨ Features

### Backend (Express.js + MongoDB)

- ✅ **User Authentication** - JWT-based secure authentication with bcrypt password hashing
- ✅ **Bus Booking System** - Search and book bus tickets with real-time availability
- ✅ **Flight Booking System** - Search and book flights with multiple airlines
- ✅ **Hotel Reservations** - Browse and book hotels with advanced filters
- ✅ **Travel Packages** - Pre-designed tour packages for popular destinations
- ✅ **Booking Management** - Comprehensive booking tracking and history
- ✅ **RESTful API** - Clean, well-documented API endpoints
- ✅ **Database Seeding** - Auto-populate with sample data on first run
- ✅ **CORS Enabled** - Secure cross-origin resource sharing

### Frontend (Vanilla JS + Bootstrap 5)

- ✅ **Modern UI/UX** - Premium design with glassmorphism and smooth animations
- ✅ **User Dashboard** - Manage all bookings and profile in one place
- ✅ **Real-time Search** - Dynamic search for buses, flights, and hotels
- ✅ **Authentication Flow** - Secure login/register with form validation
- ✅ **Mobile Responsive** - Fully responsive design for all devices
- ✅ **Interactive Cards** - Rich, detailed cards with hover effects and micro-animations
- ✅ **Journey Timeline** - Visual timeline for bus and flight journeys
- ✅ **Filter System** - Advanced filtering for hotels and packages

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (running locally or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd YOPM5/voyago
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the **root directory** (`YOPM5/`) with:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/voyago
   JWT_SECRET=your-secret-key-here-change-in-production
   ```

   > **Note:** The server looks for `.env` two levels up from the server directory.

4. **Start MongoDB**

   Make sure MongoDB is running on your system:

   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   sudo systemctl start mongod
   ```

5. **Run the application**

   ```bash
   # From the server directory
   npm run dev
   ```

   Or use the convenience script from the root:

   ```bash
   # From the voyago directory
   npm run dev
   ```

6. **Seed the database (optional)**

   The database will be automatically seeded on first run. To manually seed:

   ```bash
   # From the server directory
   npm run seed
   ```

7. **Access the application**

   Open your browser and navigate to:

   ```
   http://localhost:5000
   ```

## 📁 Project Structure

```
voyago/
├── client/                    # Frontend files (served statically)
│   ├── css/
│   │   └── style.css         # Custom styles with modern design
│   ├── js/
│   │   ├── main.js           # Global utilities & API wrapper
│   │   ├── auth.js           # Authentication logic
│   │   ├── home.js           # Homepage dynamic content
│   │   ├── bus.js            # Bus search & booking logic
│   │   ├── flight.js         # Flight search & booking logic
│   │   ├── hotel.js          # Hotel search & booking logic
│   │   ├── package.js        # Package browsing & booking logic
│   │   └── dashboard.js      # User dashboard logic
│   ├── index.html            # Homepage with hero section
│   ├── login.html            # Login page
│   ├── register.html         # Registration page
│   ├── bus.html              # Bus search & booking page
│   ├── flight.html           # Flight search & booking page
│   ├── hotel.html            # Hotel search & booking page
│   ├── package.html          # Travel packages page
│   └── dashboard.html        # User dashboard
│
├── server/                    # Backend files
│   ├── config/
│   │   └── db.js             # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js      # User authentication
│   │   ├── busController.js       # Bus operations
│   │   ├── flightController.js    # Flight operations
│   │   ├── hotelController.js     # Hotel operations
│   │   ├── packageController.js   # Package operations
│   │   └── bookingController.js   # Booking management
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── models/
│   │   ├── User.js           # User schema
│   │   ├── Bus.js            # Bus schema
│   │   ├── Flight.js         # Flight schema
│   │   ├── Hotel.js          # Hotel schema
│   │   ├── Package.js        # Package schema
│   │   └── Booking.js        # Booking schema
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── bus.js            # Bus routes
│   │   ├── flights.js        # Flight routes
│   │   ├── hotels.js         # Hotel routes
│   │   ├── packages.js       # Package routes
│   │   └── bookings.js       # Booking routes
│   ├── utils/
│   │   └── seed.js           # Database seeding utility
│   ├── server.js             # Express app entry point
│   └── package.json          # Server dependencies
│
├── package.json              # Root package.json with convenience scripts
└── .env                      # Environment variables (create this)
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
  - Body: `{ name, email, password }`
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

### Buses

- `GET /api/bus` - Get all buses
- `GET /api/bus?from=<city>&to=<city>&date=<date>` - Search buses
- `POST /api/bus/book` - Book bus ticket (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ busId, seats, date, passengerDetails }`

### Flights

- `GET /api/flights` - Get all flights
- `GET /api/flights?from=<city>&to=<city>&date=<date>` - Search flights
- `GET /api/flights/:id` - Get flight by ID
- `POST /api/flights/book` - Book flight (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ flightId, seats, date, passengerDetails }`

### Hotels

- `GET /api/hotels` - Get all hotels
- `GET /api/hotels?city=<city>&checkIn=<date>&checkOut=<date>` - Search hotels
- `GET /api/hotels/:id` - Get hotel by ID
- `POST /api/hotels/book` - Book hotel room (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ hotelId, rooms, checkIn, checkOut, guestDetails }`

### Packages

- `GET /api/packages` - Get all packages
- `GET /api/packages/:id` - Get package by ID
- `POST /api/packages/book` - Book package (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ packageId, travelers, startDate }`

### Bookings

- `GET /api/bookings` - Get user's bookings (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Returns all bookings for the authenticated user
- `GET /api/bookings/:id` - Get booking by ID (Protected)
  - Headers: `Authorization: Bearer <token>`
- `DELETE /api/bookings/:id` - Cancel booking (Protected)
  - Headers: `Authorization: Bearer <token>`

## 🛠️ Technologies Used

### Backend

- **Express.js** (v4.18.2) - Fast, unopinionated web framework
- **MongoDB** - NoSQL database
- **Mongoose** (v7.0.3) - Elegant MongoDB object modeling
- **JWT** (jsonwebtoken v9.0.0) - Secure authentication tokens
- **bcryptjs** (v2.4.3) - Password hashing
- **dotenv** (v16.0.3) - Environment variable management
- **cors** (v2.8.5) - Cross-origin resource sharing
- **nodemon** (v2.0.22) - Development auto-reload

### Frontend

- **Vanilla JavaScript** - No frameworks, pure ES6+ JavaScript
- **Bootstrap 5** - Responsive UI framework
- **AOS (Animate On Scroll)** - Scroll animations
- **Google Fonts** - Poppins font family
- **CSS3** - Modern styling with gradients, glassmorphism, and animations

## 🎨 Design Features

- **Premium Color Palette** - Vibrant gradients and professional blue theme
- **Smooth Animations** - AOS library for scroll animations and CSS transitions
- **Glassmorphism** - Modern frosted glass card designs
- **Responsive Layout** - Mobile-first approach with Bootstrap grid
- **Micro-interactions** - Hover effects, button animations, and transitions
- **Journey Timeline** - Visual representation of travel routes
- **Rich Cards** - Detailed information cards with ratings, amenities, and pricing
- **Dynamic Content** - Real-time updates and interactive elements

## 📝 Sample Data

The application comes with pre-seeded data (automatically loaded on first run):

- **Buses** - Multiple routes across major Indian cities (Delhi, Mumbai, Bangalore, etc.)
- **Flights** - Domestic flights with various airlines (Air India, IndiGo, SpiceJet, etc.)
- **Hotels** - Luxury and budget options in popular destinations
- **Packages** - Curated tour packages for popular tourist spots

## 🔐 Security Features

- **Password Hashing** - bcrypt with salt rounds for secure password storage
- **JWT Authentication** - Stateless token-based authentication
- **Protected Routes** - Middleware to verify authentication on sensitive endpoints
- **Input Validation** - Server-side validation for all user inputs
- **CORS Configuration** - Controlled cross-origin access
- **Environment Variables** - Sensitive data stored in .env file

## 📱 Pages Overview

### Public Pages

- **Homepage** (`index.html`) - Hero section, popular destinations, featured packages
- **Login** (`login.html`) - User authentication
- **Register** (`register.html`) - New user registration
- **Bus Booking** (`bus.html`) - Search and book bus tickets
- **Flight Booking** (`flight.html`) - Search and book flights
- **Hotel Booking** (`hotel.html`) - Search and book hotels
- **Packages** (`package.html`) - Browse travel packages

### Protected Pages

- **Dashboard** (`dashboard.html`) - User profile and booking management


## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Made by Abhishek & Shital**
