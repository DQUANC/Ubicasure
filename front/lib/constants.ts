import type { StationType } from "./types";

export const GUATEMALA_CITY_CENTER = { lat: 14.6349, lng: -90.5069 };

export const GUATEMALA_CITY_BOUNDS = {
  lat: { min: 14.53, max: 14.68 },
  lng: { min: -90.64, max: -90.47 },
};

export const STATION_TYPES: StationType[] = [
  "Policia Nacional",
  "Policia Municipal",
  "Bombero Municipal",
  "Bombero Voluntario",
];

export const MARKER_ICONS: Record<StationType, string> = {
  "Policia Nacional": "/img/nationalPolice.png",
  "Policia Municipal": "/img/municipalPolice.png",
  "Bombero Municipal": "/img/municipalFire.png",
  "Bombero Voluntario": "/img/volunteerFire.png",
};

export function latLngOutOfBounds(lat: number, lng: number): boolean {
  if (!lat || !lng) return false;
  return (
    lat < GUATEMALA_CITY_BOUNDS.lat.min ||
    lat > GUATEMALA_CITY_BOUNDS.lat.max ||
    lng < GUATEMALA_CITY_BOUNDS.lng.min ||
    lng > GUATEMALA_CITY_BOUNDS.lng.max
  );
}
