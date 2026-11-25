import type { Story, User } from "./types";

// Every call goes to /api; Vite forwards it to the Express server, and the browser
// sends the httpOnly cookie along by itself.
async function request<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (response.status === 204) return undefined as T;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { error?: string }).error ?? `Request failed (${response.status})`);
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
