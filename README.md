# Dromos MedRide — full stack (V1)

React frontend + Supabase backend (database, auth, and row-level security —
no separate server to write or host). Colors match the compass logo (navy
#1B4965, orange #D66B1F, cream #F5F0E6, teal #1D8A6D), all defined once in
`src/styles/theme.css`.

## Pages

**Passenger**
- `/` — home
- `/book` — booking form (validation, loading, error retry, success)
- `/login` — log in / sign up / continue as guest
- `/my-rides` — ride history, live status stepper, cancel action

**Driver**
- `/drivers/apply` — one-time application form. No ongoing driver app or
  login exists in V1 by design (Section 5/8 of the system layout) —
  coordination stays manual, by phone/WhatsApp.

**Admin** — now behind a real login
- `/admin/login` — dispatcher sign-in (this is new)
- `/admin/trips` — bookings table, filter by status
- `/admin/drivers` — approve applications, toggle driver availability
- `/admin/users` — passengers who created an account (most bookings are
  guest, so this list will often be short — that's expected)
- `/admin/vehicles` — the driver-owned fleet
- `/admin/payments` — mark trips paid, see collected vs. outstanding totals
- `/admin/reports` — trip counts and revenue snapshot

Every `/admin/...` route is now wrapped in `RequireAuth`, which redirects to
`/admin/login` if there's no active session — this was the one real gap
flagged earlier, and it's closed.

## Backend setup (Supabase)

1. Create a free project at supabase.com.
2. In the SQL Editor, run these three files **in order**:
   - `schema.sql` — `bookings` and `drivers` tables, plus RLS policies
   - `driver_applications_schema.sql` — the `driver_applications` table
   - `schema_v2_additions.sql` — adds `cancelled` status, the `profiles`
     table, and a policy letting a guest cancel their own booking
3. **Create your dispatcher account.** There's deliberately no public
   sign-up form for `/admin` — you don't want strangers creating dispatcher
   accounts. In the Supabase dashboard: **Authentication → Users → Add
   user**, and enter an email/password for yourself. That's the account
   you'll use to log in at `/admin/login`.
4. Copy your project's URL and anon key from **Settings → API**.

## Frontend setup

1. `npm install`
2. Create `.env` in the project root:
   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
   ```
3. `npm run dev`
4. Visit `/admin/login`, sign in with the dispatcher account you created in
   Supabase, and you're into the real dashboard.

## Still not built (be aware before you rely on these)

- **Price estimate** isn't calculated from distance yet — needs the maps API
  work for the 30km flat-fee rule discussed earlier.
- **Notifications** (email/WhatsApp when a driver is assigned) aren't wired
  up — the dispatcher currently just sees the booking in the Trips table.
- **Passenger phone-based login is a workaround** — Supabase Auth is
  email-first, so `Login.jsx` maps a phone number to a placeholder email
  internally. Works, but Supabase also supports real SMS OTP login if you
  want to upgrade this later.
- **M-Pesa payment is still manual** — the dispatcher marks a booking paid
  by hand in `/admin/payments`; no STK push integration yet.
