import type { AuthResponse, Credentials, RegisterData, User } from "./types";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {}
) {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  const response = await fetch(`/api${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError((data as { error?: string }).error ?? "Request failed", response.status);
  }
  return data as T;
}

export const api = {
  login: (credentials: Credentials) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: credentials }),
  register: (data: RegisterData) =>
    request<AuthResponse>("/auth/register", { method: "POST", body: data }),
  getProfile: (token: string) => request<{ user: User }>("/profile", { token }),
  updateProfile: (token: string, changes: Pick<User, "name" | "bio">) =>
    request<{ user: User }>("/profile", { method: "PUT", body: changes, token }),
};
