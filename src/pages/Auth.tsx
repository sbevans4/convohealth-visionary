
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
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
          <CardHeader className="space-y-1 bg-medical-50 p-6">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-medical-600 flex items-center justify-center">
                <span className="text-white text-lg font-bold">CN</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold text-center">
              {isLogin ? "Welcome back" : "Create an account"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? "Enter your credentials to access your account" 
                : "Enter your information to create an account"}
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 p-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="name" 
                      placeholder="Dr. John Smith" 
                      className="pl-9"
                      required 
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="doctor@example.com" 
                    className="pl-9"
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {isLogin && (
                    <Link 
                      to="#" 
                      className="text-xs text-medical-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="pl-9"
                    required 
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 bg-background border-t p-6">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  isLogin ? "Sign in" : "Create account"
                )}
              </Button>
              
              <div className="relative flex items-center justify-center w-full">
                <div className="border-t w-full"></div>
                <div className="absolute bg-card px-2 text-xs text-muted-foreground">
                  OR
                </div>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/dashboard")}
              >
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="h-4 w-4 mr-2" />
                {isLogin ? "Sign in with Google" : "Sign up with Google"}
              </Button>
              
              <div className="text-center text-sm">
                {isLogin ? (
                  <p>
                    Don't have an account?{" "}
                    <button 
                      type="button"
                      className="text-medical-600 hover:underline font-medium"
                      onClick={() => setIsLogin(false)}
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button 
                      type="button"
                      className="text-medical-600 hover:underline font-medium"
                      onClick={() => setIsLogin(true)}
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
