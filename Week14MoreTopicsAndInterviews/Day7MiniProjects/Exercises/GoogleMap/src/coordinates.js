export function parseCoordinates(latitude, longitude) {
  if (!String(latitude).trim() || !String(longitude).trim())
    return { error: "Enter both latitude and longitude." };
  const lat = Number(latitude),
    lng = Number(longitude);
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return { error: "Latitude must be -90 to 90 and longitude -180 to 180." };
  }
  return { lat, lng };
}
