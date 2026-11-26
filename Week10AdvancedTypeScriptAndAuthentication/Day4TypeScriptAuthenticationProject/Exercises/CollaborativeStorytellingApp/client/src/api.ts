import type { Story, StoryComment, User } from "./types";

let readAccessToken: () => string | null = () => null;
let writeAccessToken: (token: string | null) => void = () => {};
let refreshPromise: Promise<void> | null = null;

export function configureAccessToken(
  read: () => string | null,
  write: (token: string | null) => void
) {
  readAccessToken = read;
  writeAccessToken = write;
}

async function renewSession(): Promise<void> {
  refreshPromise ??= request<{ accessToken: string }>("/auth/refresh", "POST", undefined, false)
    .then(data => {
      writeAccessToken(data.accessToken);
    })
    .catch(error => {
      writeAccessToken(null);
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

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
  const accessToken = readAccessToken();
  if (accessToken) headers.Authorization = "Bearer " + accessToken;
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
  if (response.status === 401 && retry && (path === "/auth/me" || !path.startsWith("/auth/"))) {
    await renewSession();
    return request<T>(path, method, body, false);
  }
  if (!response.ok) {
    throw new Error(error ?? `Request failed (${response.status})`);
  }
  return data as T;
}

async function authenticate(path: string, username: string, password: string, email?: string) {
  const data = await request<{ user: User; accessToken: string }>(path, "POST", {
    username,
    password,
    email,
  });
  writeAccessToken(data.accessToken);
  return data;
}

export const api = {
  me: () => request<{ user: User }>("/auth/me"),
  login: (username: string, password: string) => authenticate("/auth/login", username, password),
  register: (username: string, password: string, email: string) =>
    authenticate("/auth/register", username, password, email),
  logout: async () => {
    const result = await request<{ message: string }>("/auth/logout", "POST");
    writeAccessToken(null);
    return result;
  },

  removeContributor: (id: number) => request<void>("/contributors/" + id, "DELETE"),
  stories: () => request<{ stories: Story[] }>("/stories"),
  createStory: (title: string, content: string) =>
    request<{ story: Story }>("/stories", "POST", { title, content }),
  updateStory: (id: number, changes: Partial<Pick<Story, "title" | "content">>) =>
    request<{ story: Story }>(`/stories/${id}`, "PATCH", changes),
  deleteStory: (id: number) => request<void>(`/stories/${id}`, "DELETE"),
  commentCapabilities: () =>
    request<{ edit: boolean; delete: boolean }>("/stories/comment-capabilities"),
  comments: (storyId: number) =>
    request<{ comments: StoryComment[] }>(`/stories/${storyId}/comments`),
  addComment: (storyId: number, body: string) =>
    request<{ comment: StoryComment }>(`/stories/${storyId}/comments`, "POST", { body }),
  updateComment: (storyId: number, commentId: number, body: string) =>
    request<{ comment: StoryComment }>(`/stories/${storyId}/comments/${commentId}`, "PATCH", {
      body,
    }),
  deleteComment: (storyId: number, commentId: number) =>
    request<void>(`/stories/${storyId}/comments/${commentId}`, "DELETE"),
  addContributor: (id: number, username: string) =>
    request<{ story: Story }>(`/stories/${id}/contributors`, "POST", { username }),
};
