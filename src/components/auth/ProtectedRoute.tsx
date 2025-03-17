
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  
  // If auth is still loading, show a loading spinner
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-medical-600" />
      </div>
    );
  }
  
  // If user is not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // If user is authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
