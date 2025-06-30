import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RoleRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.rol)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RoleRoute;
