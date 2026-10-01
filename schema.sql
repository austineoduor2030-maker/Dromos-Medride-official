-- =========================================================
-- NEMT Booking System — Sample Database Schema (Supabase/Postgres)
-- Run this in your Supabase project's SQL Editor
-- =========================================================

-- 1. DRIVERS table
create table drivers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  plate_number text,
  vehicle_type text check (vehicle_type in ('standard', 'van', 'wheelchair')),
  is_available boolean default true,
  created_at timestamptz default now()
);

-- 2. BOOKINGS table
create table bookings (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  phone text not null,
  email text,
  pickup_lat double precision,
  pickup_lng double precision,
  pickup_label text,           -- human-readable pickup name
  destination text not null,
  requested_time timestamptz not null,
  ride_type text check (ride_type in ('standard', 'van', 'wheelchair')) not null,
  trip_nature text check (trip_nature in ('one_off', 'package')) default 'one_off',
  wait_and_return boolean default false,
  driver_id uuid references drivers(id),
  status text check (status in ('pending', 'assigned', 'completed')) default 'pending',
  payment_status text check (payment_status in ('unpaid', 'paid')) default 'unpaid',
  fee numeric,
  created_at timestamptz default now()
);

-- =========================================================
-- ROW-LEVEL SECURITY
-- =========================================================
alter table bookings enable row level security;
alter table drivers enable row level security;

-- Anyone (even unauthenticated patients) can CREATE a booking
create policy "Anyone can create a booking"
on bookings for insert
to anon, authenticated
with check (true);

-- Only logged-in dispatchers can VIEW bookings
create policy "Authenticated users can view bookings"
on bookings for select
to authenticated
using (true);

-- Only logged-in dispatchers can UPDATE bookings (assign driver, change status)
create policy "Authenticated users can update bookings"
on bookings for update
to authenticated
using (true);

-- Only logged-in dispatchers can manage drivers
create policy "Authenticated users can view drivers"
on drivers for select
to authenticated
using (true);

create policy "Authenticated users can manage drivers"
on drivers for all
to authenticated
using (true);
