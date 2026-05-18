# Doctor Appointment System

This project uses:

- React + Vite frontend in the project root
- Node + Express backend in `server/`
- MongoDB Atlas for the shared team database

## Backend collections

- `users`
- `doctors`
- `departments`
- `appointments`
- `registrations`
- `otps`

## 1. Install dependencies

```bash
npm install
```

## 2. Create your `.env`

Copy `.env.example` to `.env` and fill in your own values:

```bash
cp .env.example .env
```

Required variables:

```env
PORT=5001
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/doctor_appointment_system?retryWrites=true&w=majority&appName=DoctorAppointmentSystem
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://localhost:5173,http://127.0.0.1:5173
GMAIL_USER=your-email@example.com
GMAIL_APP_PASSWORD=your-app-password
GROQ_API_KEY=your-groq-api-key
```

The backend reads the project root `.env` for all server commands.

### Team Atlas setup

Each teammate must do both:

1. Use the same Atlas `MONGODB_URI` in their own local `.env`
2. Add their current IP address in Atlas Network Access

If Atlas works on one laptop but not another, the usual causes are:

- missing `.env`
- wrong Atlas URI
- current IP not whitelisted in Atlas
- teammate still connected to a different/local database

## 3. Start the backend

```bash
npm run server
```

For auto-reload:

```bash
npm run dev:server
```

## 4. Sync the shared doctor/admin accounts

Use this on the shared Atlas database:

```bash
npm run sync:catalog
```

This safely syncs:

- departments
- doctors
- doctor login accounts
- platform admin/patient accounts

It does **not** wipe the whole database.

## 5. Full seed reset

Use only if you intentionally want to recreate everything:

```bash
npm run seed
```

This clears and recreates the main collections.

## 6. Start the frontend

In another terminal:

```bash
npm run dev
```

## 7. Test login credentials

After running `npm run sync:catalog` or `npm run seed`:

Admin:

- `admin@gmail.com`
- `admin01`

Patient:

- `prasanna@gmail.com`
- `prasanna`

Doctors:

- any doctor email from the catalog
- password: `doctor01`

Example doctor emails:

- `aavash.shrestha@example.com`
- `kiran.thapa@example.com`
- `neha.pradhan@example.com`

## 8. API base URL

```text
http://localhost:5001/api
```

## 9. Main backend features

- doctor login from `users` collection
- doctor availability stored in MongoDB
- appointment booking restricted to doctor availability
- admin appointment confirm/reject/cancel/complete actions
- backend validation for auth, doctors, departments, appointments, and users
- consistent success/error messages for frontend feedback

## 10. Important note

Some frontend pages were previously using hardcoded/demo data. The current backend work connects the most important panels to the real API, but every teammate still needs the correct `.env` and Atlas access for the shared data to appear.
