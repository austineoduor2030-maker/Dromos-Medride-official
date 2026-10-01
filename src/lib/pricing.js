// ⚠️ PLACEHOLDER RATES (KES) — replace with your real pricing.
// Flat fee by distance band, adjusted by vehicle type, with a package discount.
export const DISTANCE_BANDS = [
  { value: 'short', label: 'Up to 10 km', base: 1500 },
  { value: 'mid', label: '10 – 20 km', base: 2500 },
  { value: 'long', label: '20 – 30 km', base: 3500 },
];
export const VEHICLE_FACTOR = { standard: 1, van: 1.3, wheelchair: 1.5 };
export const WAIT_AND_RETURN_FEE = 1000;
export const PACKAGE_DISCOUNT = 0.1;

export function estimateFee({ band, ride_type, trip_nature, wait_and_return }) {
  const b = DISTANCE_BANDS.find((x) => x.value === band);
  if (!b) return null;
  let fee = b.base * (VEHICLE_FACTOR[ride_type] ?? 1);
  if (wait_and_return) fee += WAIT_AND_RETURN_FEE;
  if (trip_nature === 'package') fee *= 1 - PACKAGE_DISCOUNT;
  return Math.round(fee / 50) * 50;
}
