import { useAuth } from "./authContext";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
// import { CenteredLoadingSpinner } from "@/components/common/loadingSpinner";
// import { validateToken } from "@/lib/api/auth/authApi";

export function AuthWrapper({ children }) {
  const { token, isLoading, logout, updateUser } = useAuth();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);

  useEffect(() => {
    const validate = async () => {
      if (!token || hasValidated) return;

      setIsValidating(true);
      try {
        // const userData = await validateToken();
        // updateUser(userData);
        // setHasValidated(true);
      } catch (error) {
        logout();
      } finally {
        setIsValidating(false);
      }
    };

    validate();
  }, [token, logout, hasValidated, updateUser]);

  if (isLoading || isValidating) {
    return (
      <div className="flex justify-center min-h-screen w-full">
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
