import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRoutesProps {
  isAuthenticated: boolean;

  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRoutesProps> = ({
  isAuthenticated,

  children,
}) => {
  const location = useLocation();

  // Save the current path to localStorage
  React.useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("lastVisitedPath", location.pathname);
    }
  }, [isAuthenticated, location.pathname]);

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
