import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
export default function PrivateRoute({ children }: { children: ReactNode }) {
  const authenticated = useAppSelector(s => s.auth.isAuthenticated),
    navigate = useNavigate();
  useEffect(() => {
    if (!authenticated) navigate("/ninja/login", { replace: true });
  }, [authenticated, navigate]);
  return authenticated ? children : null;
}
