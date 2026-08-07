# Travel & Hotel Platform — Backend (Fresh Build)

This is a from-scratch Express/Mongoose backend for a Customer / Travel Agency
/ Admin platform covering both **Tour Packages** and a full **Hotel Booking**
module (search, rooms, live availability, bookings, payments, reviews).

## Why a fresh backend

The original uploaded project (`PCTE_app`) was a Student/Faculty trip
approval system. Rather than bolt hotels onto that schema, this rebuilds the
data layer around the roles and entities the spec actually calls for:
`customer`, `agency`, `admin`, `Package`, `Hotel`, `Room`, `RoomAvailability`,
`HotelBooking`, `PackageBooking`, `Payment`, `Review`, `Wishlist`,
`Notification`, `ContactMessage`, `Coupon`.

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in real values (see below)
npm run seed            # optional: creates demo admin/agency/customer + sample data
npm run dev              # starts on http://localhost:5000
```

Requires a running MongoDB instance (local or Atlas) at `MONGO_URI`.

## What's real vs. stubbed

Every third-party integration point works **out of the box in dev mode**
without any keys, so you (or the frontend) can build and test the full flow
before wiring up real credentials:

| Service      | No keys set                                   | Keys set                          |
|--------------|------------------------------------------------|------------------------------------|
| Cloudinary   | Images saved to local `/uploads`, served statically | Uploaded to Cloudinary, CDN URL returned |
| Razorpay     | `/api/payments/create-order` returns a mock order; `/verify` auto-accepts | Real order created, signature cryptographically verified |
| Nodemailer   | Emails logged to console instead of sent       | Sent via configured SMTP/Gmail account |

This means: **you can demo the entire booking → payment → confirmation →
invoice flow today**, and swap in real keys later without touching any
controller code.

## Auth & roles

- `POST /api/auth/register` — registers as `customer` by default, or `agency`
  (pass `role: "agency"`). Agencies start with `agencyStatus: "pending"` and
  cannot list packages/hotels until an admin approves them via
  `PUT /api/dashboard/admin/agencies/:id/status`.
- JWT is returned on login/register (except pending agencies) and must be
  sent as `Authorization: Bearer <token>`.
- `admin` accounts are never self-registered — create one via the seeder or
  directly in the database.

## Key business rules encoded in the models/controllers

- **Packages & Hotels both require admin approval** (`status: pending` on
  creation) before they appear in public search — mirrors "Package Approval"
  / "Hotel Approval" from the spec.
- **Bookings go through 3 states**: `pending_payment` → (payment verified) →
  `pending_approval` → (agency approves/rejects) → `confirmed`/`rejected`.
  This matches "Approve or Reject Bookings" for both agencies and hotel
  owners.
- **Room availability is tracked per-date** in `RoomAvailability`, so
  "Live Room Availability" and overbooking checks work without scanning all
  bookings.
- **Seasonal pricing** on `Room.seasonalPricing` lets hotel owners set
  different nightly rates for date ranges ("Dynamic Pricing").
- **Coupons** apply to either packages, hotels, or both, with percent/flat
  discount types and usage limits.

## Folder structure

```
backend/src/
  config/       # db, cloudinary, razorpay
  models/       # Mongoose schemas
  middleware/   # auth (JWT + roles), upload, error handler
  controllers/  # business logic, one file per resource
  routes/       # Express routers, mounted in server.js
  utils/        # token, email, OTP, query-features helpers
  server.js     # app entry point
  seeder.js     # demo data
```

## Not yet built (next steps)

This pass covers the **backend data layer and API only**, per your last
message. Still to do for a complete product:
- React frontend (customer site, agency dashboard, admin dashboard)
- Google Maps integration on the frontend (backend already stores
  `lat`/`lng` for hotels and packages)
- Email templates beyond the OTP one (booking confirmations currently send
  plain text — HTML templates are a quick follow-up)
- Automated release of seat/room holds if a customer abandons checkout
  before paying (a TTL index or cron job on `pending_payment` bookings older
  than N minutes)
- Rate limiting / request validation middleware (e.g. `express-validator`)
  for stricter input checking beyond Mongoose schema validation
- Tests

I haven't been able to run this against a live MongoDB instance in this
environment, so please run `npm install && npm run dev` locally (or in
Claude Code, which can actually execute and iterate on it) and let me know
if anything throws — happy to fix issues as they come up.
