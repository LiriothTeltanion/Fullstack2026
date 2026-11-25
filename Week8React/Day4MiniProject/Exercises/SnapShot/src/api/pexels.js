const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

export const hasApiKey = Boolean(API_KEY);

export async function searchPhotos(query) {
  const params = new URLSearchParams({ query, per_page: "24" });
  const response = await fetch(`https://api.pexels.com/v1/search?${params}`, {
    headers: { Authorization: API_KEY },
  });
  if (!response.ok) {
    throw new Error(`Pexels answered with status ${response.status}`);
  }
  const data = await response.json();
  return data.photos;
}
