import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loader from './Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { admin, loading } = useAuth();

  if (loading) return <Loader />;

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  // agar allowedRoles pass nahi ki gayi, to sirf login-check kaafi hai (purana behavior)
  if (allowedRoles && !allowedRoles.includes(admin.role)) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;