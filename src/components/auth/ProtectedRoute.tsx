import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth/token";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    // assumes language prefix exists before this route
    return <Navigate to="../auth/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}
