import type { Story, User } from "./types";

// The server wants a CSRF token on every POST, PATCH and DELETE. I fetch it once
// and keep the promise, so calls made at the same time share one request.
let csrfToken: Promise<string> | null = null;

function getCsrfToken(): Promise<string> {
  csrfToken ??= fetch("/api/csrf-token")
    .then(response => response.json() as Promise<{ csrfToken: string }>)
    .then(data => data.csrfToken)
    .catch(err => {
      csrfToken = null; // try again on the next call
      throw err;
    });
  return csrfToken;
}

// Every call goes to /api; Vite forwards it to the Express server, and the browser
// sends the httpOnly cookies along by itself.
async function request<T>(path: string, method = "GET", body?: unknown, retry = true): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (method !== "GET") headers["x-csrf-token"] = await getCsrfToken();

  const response = await fetch(`/api${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (response.status === 204) return undefined as T;
  const data = await response.json().catch(() => ({}));
  const error = (data as { error?: string }).error;
  // After a server restart the old session is gone, so the saved token stops matching.
  if (response.status === 403 && error?.startsWith("CSRF token") && retry) {
    csrfToken = null;
    return request<T>(path, method, body, false);
  }
  if (!response.ok) {
    throw new Error(error ?? `Request failed (${response.status})`);
  }
  return data as T;
}

export const api = {
  me: () => request<{ user: User }>("/auth/me"),
  login: (username: string, password: string) =>
    request<{ user: User }>("/auth/login", "POST", { username, password }),
  register: (username: string, password: string) =>
    request<{ user: User }>("/auth/register", "POST", { username, password }),
  logout: () => request<{ message: string }>("/auth/logout", "POST"),

  stories: () => request<{ stories: Story[] }>("/stories"),
  createStory: (title: string, content: string) =>
    request<{ story: Story }>("/stories", "POST", { title, content }),
  updateStory: (id: number, changes: Partial<Pick<Story, "title" | "content">>) =>
    request<{ story: Story }>(`/stories/${id}`, "PATCH", changes),
  deleteStory: (id: number) => request<void>(`/stories/${id}`, "DELETE"),
  addContributor: (id: number, username: string) =>
    request<{ story: Story }>(`/stories/${id}/contributors`, "POST", { username }),
};
