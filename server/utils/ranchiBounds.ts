export const RANCHI_BOUNDS = {
  // Geofence (Ranchi): [23.28, 85.25] to [23.45, 85.45]
  south: 23.28,
  west: 85.25,
  north: 23.45,
  east: 85.45,
};

export function isWithinRanchi(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= RANCHI_BOUNDS.south &&
    lat <= RANCHI_BOUNDS.north &&
    lng >= RANCHI_BOUNDS.west &&
    lng <= RANCHI_BOUNDS.east
  );
}
