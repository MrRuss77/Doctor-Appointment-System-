# Doctor Appointment System

This project currently has:

- A Vite + React frontend in the project root
- A new Node + Express + MongoDB backend in `server/`

## Collections created for MongoDB

The backend is structured around these MongoDB collections:

- `users`
- `doctors`
- `departments`
- `appointments`
- `registrations`

## 1. Install dependencies

From the project root run:

```bash
npm install
```

## 2. Create your environment file

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then set your MongoDB connection string inside `.env`.

Example for local MongoDB:

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/doctor_appointment_system
CLIENT_URL=http://localhost:5173
```

Example for MongoDB Atlas:

```env
PORT=5001
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/doctor_appointment_system
CLIENT_URL=http://localhost:5173
```

## 3. Start the backend

```bash
npm run server
```

For auto-reload during development:

```bash
npm run dev:server
```

## Optional: create sample records immediately

To create all five collections with sample data:

```bash
npm run seed
```

This will insert sample records into:

- `users`
- `departments`
- `doctors`
- `registrations`
- `appointments`

## 4. Start the frontend

In another terminal:

```bash
npm run dev
```

## 5. API endpoints

Base URL:

```text
http://localhost:5001/api
```

Available endpoints:

- `GET /api/health`
- `GET|POST /api/users`
- `GET|PUT|DELETE /api/users/:id`
- `GET|POST /api/doctors`
- `GET|PUT|DELETE /api/doctors/:id`
- `GET|POST /api/departments`
- `GET|PUT|DELETE /api/departments/:id`
- `GET|POST /api/appointments`
- `GET|PUT|DELETE /api/appointments/:id`
- `GET|POST /api/registrations`
- `GET|PUT|DELETE /api/registrations/:id`

## Suggested order to enter data

1. Create departments first
2. Create doctors and link them to departments
3. Create users
4. Create registrations for users
5. Create appointments linked to a user, doctor, and department

## Notes

- In MongoDB, these are collections, not SQL tables
- The `Prasanna/` folder looks like an older copy of the frontend and is not required for the new backend setup
- If you want, the next step can be connecting the React frontend to these APIs instead of using hardcoded doctor data
