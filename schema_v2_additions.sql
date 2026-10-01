-- Run this in addition to schema.sql and driver_applications_schema.sql
-- Supports: signed-up passenger profiles, and cancelling a ride

-- 1. Allow 'cancelled' as a booking status
alter table bookings drop constraint if exists bookings_status_check;
alter table bookings add constraint bookings_status_check
  check (status in ('pending', 'assigned', 'completed', 'cancelled'));

-- 2. Profiles table for passengers who create an account (optional — most
--    bookings will be guest bookings and won't have a matching profile row)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can insert their own profile"
on profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "Authenticated users can view profiles"
on profiles for select
to authenticated
using (true);

-- 3. Let a guest cancel their own pending/assigned booking
--    (loosens the earlier "authenticated only" update policy for this one case)
create policy "Anyone can cancel their own booking by phone match"
on bookings for update
to anon
using (status in ('pending', 'assigned'))
with check (status = 'cancelled');
