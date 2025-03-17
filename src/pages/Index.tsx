import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Landing from './Landing';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Redirect based on authentication status
  useEffect(() => {
    if (user) {
      // If logged in, go to dashboard
      navigate('/dashboard', { replace: true });
    } else {
      // Otherwise, go to landing
      navigate('/landing', { replace: true });
    }
  }, [navigate, user]);
  
  // While redirecting, render the Landing component
  return <Landing />;
};

export default Index;
