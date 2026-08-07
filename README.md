# Travel & Stay — Travel Agency + Hotel Booking Platform (MERN)

A fresh MERN build for a Customer / Travel Agency / Admin platform covering
both tour packages and a full hotel booking module (search, live room
availability, seasonal pricing, Razorpay payments, PDF invoices, reviews,
wishlists, coupons, admin/agency analytics).

## Quick start

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env
npm run seed      # demo admin/agency/customer accounts + sample listings
npm run dev       # http://localhost:5000

# 2. Frontend (separate terminal)
cd frontend
npm install
npm run dev       # http://localhost:5173
```

Requires a running MongoDB instance (local or Atlas) — set `MONGO_URI` in
`backend/.env`.

## Demo logins (after running the seeder)

| Role     | Email                     | Password      |
|----------|----------------------------|---------------|
| Admin    | admin@travelstay.com      | Admin@123     |
| Agency   | agency@travelstay.com     | Agency@123    |
| Customer | customer@travelstay.com   | Customer@123  |

## What works without any real API keys

Razorpay, Cloudinary, and SMTP email all have safe dev-mode fallbacks (mock
payment orders, local disk image storage, console-logged emails), so the
entire booking → payment → confirmation → invoice flow can be tested end to
end before you have real credentials. See `backend/README.md` for details.

## Structure

```
backend/    Express + Mongoose API (see backend/README.md)
frontend/   React + Vite + Tailwind app (see frontend/README.md)
```

## Status

This is a solid, review-checked foundation — every backend module was
syntax- and import-checked by actually booting the server, and every
frontend file passed a full Vite production build (487 modules, zero
errors). It has **not** been run against a live MongoDB + browser session in
this environment, so budget time for a first real run-through. Each
README lists the specific gaps left for a production launch (image upload
UI, room management screens, Google Maps embed, abandoned-cart cleanup,
tests, etc).

Given the size of this project, continuing in **Claude Code** (desktop,
terminal, or IDE extension) from here is the fastest path — it can run both
servers, hit real endpoints, and iterate against actual errors instead of
guessing blind in a chat window.
