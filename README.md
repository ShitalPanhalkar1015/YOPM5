# Trip Planner API

This is the backend API for the Trip Planner application, built with Node.js, Express, and MongoDB. It provides a RESTful API for managing users and their trips.

## Features

- User registration and authentication using JSON Web Tokens (JWT)
- Secure password hashing with bcrypt
- CRUD (Create, Read, Update, Delete) operations for trips
- Protected routes to ensure only authenticated users can manage their trips
- Dockerized for easy setup and deployment

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (if not using Docker)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (optional)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies

Navigate to the `server` directory and install the required npm packages.

```bash
cd server
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project (not in the `server` directory) and add the necessary environment variables. You can use `.env.example` as a template.

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
NODE_ENV=development
```

### 4. Run the server

You can run the server in development mode, which will automatically restart on file changes.

```bash
npm run dev
```

The server will start on the port specified in your `.env` file (e.g., `http://localhost:5000`).

## API Endpoints

All endpoints are prefixed with `/api`.

### Auth

- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Log in a user and receive a JWT.

### Trips

- `GET /trips`: Get all trips for the authenticated user.
- `POST /trips`: Create a new trip.
- `GET /trips/:id`: Get a single trip by its ID.
- `PUT /trips/:id`: Update a trip.
- `DELETE /trips/:id`: Delete a trip.

## Seeding the Database

You can seed the database with sample data using the provided script.

```bash
# From the server directory
npm run seed:import
```

To delete all data from the database:

```bash
# From the server directory
npm run seed:delete
```

## Running with Docker

You can also run the entire application stack using Docker Compose.

1.  **Build and run the containers:**

    ```bash
    docker-compose up --build
    ```

    This will start the Node.js application and a MongoDB database in separate containers. The application will be available at `http://localhost:5000`.

2.  **To stop and remove the containers:**

    ```bash
    docker-compose down
    ```