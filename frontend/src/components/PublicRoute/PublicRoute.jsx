import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function PublicRoute() {
  const location = useLocation();
  const { authorized, loading } = useContext(UserContext);
  
  if (loading) {
    return null;
  }

  return !authorized || location.pathname === "/registration" ? <Outlet /> : <Navigate to="/main" />;
}

export default PublicRoute;