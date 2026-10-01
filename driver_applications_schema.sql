-- Run this in addition to your existing schema.sql
-- Supports the "Become a driver-partner" application form

create table driver_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  national_id text,
  license_number text not null,
  psv_badge_number text,
  vehicle_type text check (vehicle_type in ('standard', 'van', 'wheelchair')),
  plate_number text not null,
  review_status text check (review_status in ('pending', 'approved', 'rejected')) default 'pending',
  created_at timestamptz default now()
);

alter table driver_applications enable row level security;

-- Anyone can submit an application
create policy "Anyone can submit a driver application"
on driver_applications for insert
to anon, authenticated
with check (true);

-- Only the dispatcher/admin can view or review applications
create policy "Authenticated users can view driver applications"
on driver_applications for select
to authenticated
using (true);

create policy "Authenticated users can update driver applications"
on driver_applications for update
to authenticated
using (true);
