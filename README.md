# YOPM5 (Voyago frontend + server scaffold)

This repository contains the Voyago travel booking frontend and server scaffold (Express + Mongoose).  
The frontend is Bootstrap 5-based and located under the `client/` folder.

## What's included
- Client: static HTML/CSS/JS pages (landing, login, register, bus, hotel, package, dashboard).
- Server: basic Express app and MongoDB connection helpers under `server/`.

## Recent changes
- Added a `.gitignore` at the project root to exclude node_modules, .env and common build/IDE files.
- Improved UI styling (client/css/style.css): gradient theme, enhanced hero overlay, button/card hover effects and responsive tweaks.

## Quick start
1. Install dependencies:
   - npm install
2. Configure environment variables:
   - Copy `.env.example` (create one) and set `MONGO_URI`, `PORT`, `JWT_SECRET`.
3. Seed data (optional):
   - npm run seed
4. Start server:
   - npm run dev

## Notes
- The frontend uses fetch() to call the API at `http://localhost:5000`. Ensure the backend is running and ports match.
- JWT tokens are stored in localStorage (key: `voyago_token`).

## License
- MIT / personal use