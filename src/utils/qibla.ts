// Shared Qibla and Coordinate Utilities for Qalb

export const KAABA_LAT = 21.422487;
export const KAABA_LNG = 39.826206;

export interface QiblaCalculationResult {
  bearing: number; // 0 - 360
  cardinal: string; // e.g. "ENE", "WNW", "NW"
  distanceKm: number;
}

export function getCardinalDirection(deg: number): string {
  const directions = [
    "N", "NNE", "NE", "ENE",
    "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW",
    "W", "WNW", "NW", "NNW"
  ];
  const normalized = ((deg % 360) + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;
  return directions[index];
}

export function computeQibla(latitude: number, longitude: number): QiblaCalculationResult {
  const latRad = (latitude * Math.PI) / 180;
  const lngRad = (longitude * Math.PI) / 180;
  const kLatRad = (KAABA_LAT * Math.PI) / 180;
  const kLngRad = (KAABA_LNG * Math.PI) / 180;

  const y = Math.sin(kLngRad - lngRad);
  const x =
    Math.cos(latRad) * Math.tan(kLatRad) -
    Math.sin(latRad) * Math.cos(kLngRad - lngRad);

  let qibla = (Math.atan2(y, x) * 180) / Math.PI;
  qibla = (qibla + 360) % 360;
  const bearing = Math.round(qibla);
  const cardinal = getCardinalDirection(bearing);

  // Haversine formula for distance
  const R = 6371; // Earth's mean radius in km
  const dLat = kLatRad - latRad;
  const dLng = kLngRad - lngRad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(latRad) * Math.cos(kLatRad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);

  return { bearing, cardinal, distanceKm };
}
