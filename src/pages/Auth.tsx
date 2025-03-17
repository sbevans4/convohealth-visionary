
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

const Auth = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const { isLoading, handleLogin, handleSignup, handleGoogleSignIn } = useAuth();

  // Check for mode parameter in URL to determine initial state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'signup') {
      setIsLogin(false);
    }
  }, [location]);

  const handleLoginSubmit = async (data: any) => {
    await handleLogin(data);
  };

  const handleSignupSubmit = async (data: any) => {
    const success = await handleSignup(data);
    if (success) {
      setIsLogin(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-medical-50 to-background">
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border shadow-soft overflow-hidden">
          <AuthHeader isLogin={isLogin} />
          
          {isLogin ? (
            <LoginForm 
              onSubmit={handleLoginSubmit}
              isLoading={isLoading}
              onSwitchToSignup={() => setIsLogin(false)}
              onGoogleSignIn={handleGoogleSignIn}
            />
          ) : (
            <SignupForm 
              onSubmit={handleSignupSubmit}
              isLoading={isLoading}
              onSwitchToLogin={() => setIsLogin(true)}
              onGoogleSignIn={handleGoogleSignIn}
            />
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
