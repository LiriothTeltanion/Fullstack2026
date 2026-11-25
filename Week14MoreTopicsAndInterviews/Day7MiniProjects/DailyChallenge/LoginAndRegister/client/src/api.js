export async function submitAccount(route, body, signal) {
  const response = await fetch("/api/" + route, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }
  if (!response.ok) throw new Error(data.error || "The request failed.");
  return data;
}
