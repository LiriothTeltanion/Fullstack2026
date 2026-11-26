import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ApiError, api } from "../api";
import type { Credentials, RegisterData, User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  sessionMessage: string;
  retrySession: () => void;
  login: (credentials: Credentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User, expectedToken: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_KEY = "auth-project-token";

// sessionStorage survives a refresh; the server's in-memory accounts do not survive a restart.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [user, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(token !== null);
  const [sessionMessage, setSessionMessage] = useState("");
  const [restoreAttempt, setRestoreAttempt] = useState(0);
  const sessionRevision = useRef(0);
  const currentToken = useRef(token);

  const clearSession = useCallback((message = "") => {
    sessionRevision.current += 1;
    currentToken.current = null;
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setCurrentUser(null);
    setLoading(false);
    setSessionMessage(message);
  }, []);

  const saveSession = (newToken: string, newUser: User, revision: number) => {
    if (revision !== sessionRevision.current) return;
    sessionStorage.setItem(TOKEN_KEY, newToken);
    currentToken.current = newToken;
    setToken(newToken);
    setCurrentUser(newUser);
    setLoading(false);
    setSessionMessage("");
  };

  useEffect(() => {
    if (!token || user) return;
    let active = true;
    const revision = sessionRevision.current;
    const isCurrent = () =>
      active && revision === sessionRevision.current && currentToken.current === token;
    setLoading(true);
    setSessionMessage("");
    api
      .getProfile(token)
      .then(({ user: profile }) => {
        if (isCurrent()) {
          setCurrentUser(profile);
          setLoading(false);
        }
      })
      .catch((error: unknown) => {
        if (!isCurrent()) return;
        if (error instanceof ApiError && (error.status === 401 || error.status === 404)) {
          clearSession(
            "Your saved session is no longer available. Please log in again, or sign up if the server restarted."
          );
        } else {
          // A temporary network failure must not erase a potentially valid saved session.
          setSessionMessage("Could not check your saved session. Check the connection and retry.");
        }
      })
      .finally(() => {
        if (isCurrent()) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token, user, restoreAttempt, clearSession]);

  // A response belongs to the session that started it, even if a later login has the same token.
  const renderRevision = sessionRevision.current;
  const value: AuthContextValue = {
    user,
    token,
    loading,
    sessionMessage,
    retrySession: () => setRestoreAttempt(attempt => attempt + 1),
    login: async credentials => {
      const revision = ++sessionRevision.current;
      const { token: newToken, user: newUser } = await api.login(credentials);
      saveSession(newToken, newUser, revision);
    },
    register: async data => {
      const revision = ++sessionRevision.current;
      const { token: newToken, user: newUser } = await api.register(data);
      saveSession(newToken, newUser, revision);
    },
    logout: () => clearSession(),
    setUser: (updated, expectedToken) => {
      if (renderRevision !== sessionRevision.current || currentToken.current !== expectedToken)
        return false;
      setCurrentUser(updated);
      return true;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
