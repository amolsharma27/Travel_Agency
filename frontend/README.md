# Travel & Hotel Platform — Frontend

React + Vite + Tailwind frontend for the Customer / Agency / Admin platform,
built against the backend API in `../backend`.

## Setup

```bash
cd frontend
npm install
npm run dev   # http://localhost:5173, proxies /api to http://localhost:5000
```

Make sure the backend is running first (`cd ../backend && npm run dev`).
For a quick walkthrough, run the backend seeder (`npm run seed`) and log in
with:
- Customer: `customer@travelstay.com` / `Customer@123`
- Agency: `agency@travelstay.com` / `Agency@123`
- Admin: `admin@travelstay.com` / `Admin@123`

## Design system

- **Colors**: deep slate-navy (`ink`), warm paper background (`paper`),
  lagoon teal primary accent (`lagoon`), sand gold for pricing/CTAs (`sand`)
- **Type**: Fraunces (display/headlines), Plus Jakarta Sans (UI/body),
  IBM Plex Mono (prices, dates, booking reference codes)
- **Signature motif**: package/hotel cards use a dashed "boarding pass"
  perforation between the image and details — see `.ticket-perforation` /
  `.ticket-dashes` in `src/index.css`, used in `HotelCard.jsx` / `PackageCard.jsx`
- Dark mode via Tailwind's `class` strategy, toggled in the navbar

## What's built

- Full route tree: home, auth (login/register/forgot-password+OTP), hotel
  search/details/booking, package search/details/booking, booking
  confirmation with PDF invoice download
- Role-aware dashboards: Customer (profile, bookings, wishlist, payments,
  notifications), Agency (analytics, packages, hotels, booking approvals),
  Admin (analytics, user/agency management, listing approvals, support)
- Razorpay Checkout integration that transparently falls back to an
  auto-confirmed "sandbox" flow when the backend has no real keys configured
  (matches the backend's mock-order behavior — see backend README)

## Known gaps / good next steps

- **Image uploads**: forms currently create packages/hotels/rooms with
  JSON only; multipart image upload UI (drag-and-drop, preview, multi-image)
  isn't wired up yet even though the backend already accepts it via Multer
- **Room management UI**: agencies can create hotels but there's no
  dedicated screen yet for adding/editing room types — currently API-only
- **Google Maps embed**: hotel details page links out to Google Maps rather
  than embedding an interactive map inline (needs a `GOOGLE_MAPS_API_KEY`
  and the Maps JavaScript API SDK)
- **Coupon UI on checkout**: the input exists but doesn't live-preview the
  discount before payment (the `/api/coupons/validate` endpoint already
  supports this)
- Loading states are all skeleton-based on lists; individual detail pages
  use a simple "Loading…" text and could use a proper skeleton
- No automated tests

As with the backend, this hasn't been run against a live backend/browser in
this environment — I'd recommend `npm run dev` locally (or continuing in
Claude Code, which can run both servers and click through the actual UI) to
catch anything that only shows up at runtime.
