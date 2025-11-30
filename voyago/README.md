# 🌍 Voyago - Modern Travel Booking Platform

A full-stack travel booking application built with **Express.js**, **MongoDB**, and **Vanilla JavaScript**. Book buses, hotels, and travel packages all in one place!

## ✨ Features

### Backend (Express.js + MongoDB)

- ✅ **User Authentication** - JWT-based secure authentication
- ✅ **Bus Booking System** - Search and book bus tickets
- ✅ **Hotel Reservations** - Browse and book hotels with filters
- ✅ **Travel Packages** - Pre-designed tour packages
- ✅ **Booking Management** - Track all your bookings
- ✅ **RESTful API** - Clean and well-documented API endpoints
- ✅ **Database Seeding** - Auto-populate with sample data

### Frontend (Vanilla JS + Bootstrap 5)

- ✅ **Modern UI/UX** - Clean, responsive design with smooth animations
- ✅ **User Dashboard** - Manage bookings and profile
- ✅ **Real-time Search** - Dynamic search for buses and hotels
- ✅ **Authentication Flow** - Login/Register with form validation
- ✅ **Mobile Responsive** - Works seamlessly on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

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

   Create a `.env` file in the root directory (`YOPM5/`) with:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/voyago
   JWT_SECRET=your-secret-key-here
   ```

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

6. **Access the application**

   Open your browser and navigate to:

   ```
   http://localhost:5000
   ```

## 📁 Project Structure

```
voyago/
├── client/                 # Frontend files
│   ├── css/
│   │   └── style.css      # Custom styles
│   ├── js/
│   │   ├── main.js        # Global utilities & API wrapper
│   │   ├── auth.js        # Authentication logic
│   │   ├── bus.js         # Bus booking logic
│   │   ├── hotel.js       # Hotel booking logic
│   │   ├── package.js     # Package booking logic
│   │   └── dashboard.js   # Dashboard logic
│   ├── index.html         # Homepage
│   ├── login.html         # Login page
│   ├── register.html      # Registration page
│   ├── bus.html           # Bus search & booking
│   ├── hotel.html         # Hotel search & booking
│   ├── package.html       # Travel packages
│   └── dashboard.html     # User dashboard
│
├── server/                # Backend files
│   ├── config/
│   │   └── db.js         # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── busController.js
│   │   ├── hotelController.js
│   │   ├── packageController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   └── auth.js       # JWT authentication middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Bus.js
│   │   ├── Hotel.js
│   │   ├── Package.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bus.js
│   │   ├── hotels.js
│   │   ├── packages.js
│   │   └── bookings.js
│   ├── utils/
│   │   └── seed.js       # Database seeding
│   ├── server.js         # Express app entry point
│   └── package.json
│
└── .env                  # Environment variables
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Buses

- `GET /api/bus?from=<city>&to=<city>&date=<date>` - Search buses
- `POST /api/bus/book` - Book bus ticket (Protected)

### Hotels

- `GET /api/hotels` - Get all hotels (with optional filters)
- `GET /api/hotels/search?city=<city>` - Search hotels by city
- `GET /api/hotels/:id` - Get hotel by ID
- `POST /api/hotels/book` - Book hotel room (Protected)

### Packages

- `GET /api/packages` - Get all packages
- `GET /api/packages/:id` - Get package by ID
- `POST /api/packages/book` - Book package (Protected)

### Bookings

- `GET /api/bookings` - Get user's bookings (Protected)
- `GET /api/bookings/:id` - Get booking by ID (Protected)

## 🛠️ Technologies Used

### Backend

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing

### Frontend

- **Vanilla JavaScript** - No frameworks, pure JS
- **Bootstrap 5** - UI framework
- **AOS** - Scroll animations
- **Google Fonts** - Poppins font

## 🎨 Design Features

- **Modern Color Palette** - Professional blue theme
- **Smooth Animations** - AOS library for scroll animations
- **Glassmorphism** - Modern card designs
- **Responsive Layout** - Mobile-first approach
- **Micro-interactions** - Hover effects and transitions

## 📝 Sample Data

The application comes with pre-seeded data:

- **6 Buses** - Various routes across India
- **6 Hotels** - Luxury and budget options
- **6 Packages** - Popular destinations

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes with middleware
- Input validation
- CORS enabled

## 🚧 Future Enhancements

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] User reviews and ratings
- [ ] Admin dashboard
- [ ] Booking cancellation
- [ ] Multi-language support
- [ ] Dark mode

## 📄 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@voyago.com or create an issue in the repository.

---

**Made with ❤️ by the Voyago Team**
