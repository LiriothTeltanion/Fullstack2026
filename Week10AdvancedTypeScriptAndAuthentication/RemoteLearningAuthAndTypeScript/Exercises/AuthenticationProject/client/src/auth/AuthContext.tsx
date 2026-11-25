import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { ApiError, api } from "../api";
import type { Credentials, RegisterData, User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_KEY = "auth-project-token";

// sessionStorage: the login survives a page refresh but ends when the tab is closed.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(token !== null);

  const saveSession = (newToken: string, newUser: User) => {
    sessionStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // A saved token is checked once with the server; an expired one logs the user out.
  useEffect(() => {
    if (!token || user) return;
    api
      .getProfile(token)
      .then(({ user: profile }) => setUser(profile))
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 401) logout();
      })
      .finally(() => setLoading(false));
  }, [token, user, logout]);

  const value: AuthContextValue = {
    user,
    token,
    loading,
    login: async credentials => {
      const { token: newToken, user: newUser } = await api.login(credentials);
      saveSession(newToken, newUser);
    },
    register: async data => {
      const { token: newToken, user: newUser } = await api.register(data);
      saveSession(newToken, newUser);
    },
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
