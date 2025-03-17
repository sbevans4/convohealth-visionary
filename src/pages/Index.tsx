import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  // Redirect based on authentication status
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // If logged in, go to dashboard
        navigate('/dashboard', { replace: true });
      } else {
        // Otherwise, go to landing
        navigate('/landing', { replace: true });
      }
    }
  }, [navigate, user, isLoading]);
  
  // While redirecting, show a loading spinner
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-medical-600" />
    </div>
  );
};

export default Index;
