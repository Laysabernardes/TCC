import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = true; // aqui vai precisar de cookies
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
