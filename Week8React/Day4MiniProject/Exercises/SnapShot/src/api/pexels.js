import { normalizeApiKey } from "../gallerySettings.js";

const API_KEY = normalizeApiKey(import.meta.env?.VITE_PEXELS_API_KEY);

export const hasApiKey = Boolean(API_KEY);

function webUrl(value) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

// A photo can still render when optional captions or credits are missing.
function normalizePhoto(photo, index) {
  const imageUrl = webUrl(photo?.src?.medium);
  if (!imageUrl) return null;
  const hasId =
    (typeof photo.id === "number" && Number.isFinite(photo.id)) ||
    (typeof photo.id === "string" && photo.id.trim() !== "");
  return {
    ...photo,
    id: hasId ? photo.id : `${imageUrl}-${index}`,
    src: { ...photo.src, medium: imageUrl },
    url: webUrl(photo.url) ?? imageUrl,
    photographer: typeof photo.photographer === "string" ? photo.photographer : "",
    alt: typeof photo.alt === "string" ? photo.alt : "",
  };
}

export async function searchPhotos(query) {
  const params = new URLSearchParams({ query, per_page: "24" });
  const response = await fetch(`https://api.pexels.com/v1/search?${params}`, {
    headers: { Authorization: API_KEY },
  });
  if (!response.ok) {
    throw new Error(`Pexels answered with status ${response.status}`);
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Pexels returned unreadable photo data. Try another search.");
  }
  if (!Array.isArray(data?.photos)) {
    throw new Error("Pexels returned an invalid photo collection. Try another search.");
  }
  const photos = data.photos.map(normalizePhoto).filter(Boolean);
  if (data.photos.length > 0 && photos.length === 0) {
    throw new Error("Pexels returned no usable photo records. Try another search.");
  }
  return photos;
}
