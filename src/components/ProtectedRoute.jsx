import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user: authUser } = useSelector((state) => state.auth);

  // Transform roles to simple form
  const roles = authUser?.roles?.map(r => r.replace("ROLE_", "").toUpperCase()) || [];

  // Guest → redirect to login
  if (!authUser) return <Navigate to="/login" replace />;

  // Role not allowed → redirect to home
  if (allowedRoles && !roles.some(r => allowedRoles.includes(r))) {
    return <Navigate to="/" replace />;
  }

  // Allowed → render children
  return children;
};

export default ProtectedRoute;