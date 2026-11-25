/** Fetch JSON while allowing the caller to cancel an obsolete request. */
export async function fetchData<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("Server answered " + response.status);
  return response.json() as Promise<T>;
}
