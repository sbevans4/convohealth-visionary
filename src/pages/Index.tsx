
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Landing from './Landing';

const Index = () => {
  const navigate = useNavigate();
  
  // Redirect to the landing page
  useEffect(() => {
    navigate('/landing', { replace: true });
  }, [navigate]);
  
  // While redirecting, render the Landing component
  return <Landing />;
};

export default Index;
