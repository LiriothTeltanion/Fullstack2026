// Thin wrapper so components never repeat fetch details.
async function request(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const getItems = () => request("/items");
export const addItem = title =>
  request("/items", { method: "POST", body: JSON.stringify({ title }) });
export const toggleItem = id => request(`/items/${id}/toggle`, { method: "PATCH" });
export const deleteItem = id => request(`/items/${id}`, { method: "DELETE" });
