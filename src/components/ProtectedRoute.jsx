import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user: authUser } = useSelector((state) => state.auth);
  const roles = authUser?.roles?.map(r => r.replace("ROLE_", "").toUpperCase()) || [];
  if (!authUser) return <Navigate to="/login" replace />;
  if (allowedRoles && !roles.some(r => allowedRoles.includes(r))) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;