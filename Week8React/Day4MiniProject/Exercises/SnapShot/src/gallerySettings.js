// Read the original path segment instead of decoding an already-decoded router parameter.
export function getPhotoQuery(pathname) {
  const segment = pathname.replace(/\/+$/, "").split("/").pop() || "";
  try {
    return decodeURIComponent(segment);
  } catch {
    return null;
  }
}

export function normalizeApiKey(value) {
  const key = (value || "").trim();
  return key === "your-pexels-api-key" ? "" : key;
}
