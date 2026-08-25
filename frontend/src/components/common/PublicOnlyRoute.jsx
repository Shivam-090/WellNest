import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
      </div>
    );
  }

  if (isAuthenticated) {
    const destination = location.state?.from || '/home';
    return <Navigate to={destination} replace />;
  }

  return children;
}
