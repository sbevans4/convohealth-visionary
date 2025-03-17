
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Lock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";

const newPasswordSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const { isLoading, handleLogin, handleSignup, handleGoogleSignIn, handleUpdatePassword } = useAuth();

  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Check for mode parameter in URL to determine initial state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'signup') {
      setIsLogin(false);
    }
    
    // Check if this is a password reset flow
    const isReset = params.get('reset') === 'true' || 
                    params.get('type') === 'recovery';
    
    if (isReset) {
      setIsResetMode(true);
    }
    
    // Check if user is coming from a password reset email
    const checkResetSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session && isReset) {
        // User has a valid session and is in reset mode
        setIsResetMode(true);
      }
    };
    
    checkResetSession();
    
    // Simulate authentication status check 
    const checkAuthStatus = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);
    
    return () => clearTimeout(checkAuthStatus);
  }, [location]);

  const handlePasswordUpdate = async (data: z.infer<typeof newPasswordSchema>) => {
    const success = await handleUpdatePassword(data.password);
    if (success) {
      setResetComplete(true);
    }
  };

  const handleLoginSubmit = async (data: any) => {
    await handleLogin(data);
  };

  const handleSignupSubmit = async (data: any) => {
    const success = await handleSignup(data);
    if (success) {
      setIsLogin(true);
    }
  };

  // Loading state UI
  if (isPageLoading) {
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md"
        >
          <Card className="border shadow-soft overflow-hidden">
            <div className="bg-medical-50 p-6 flex flex-col items-center space-y-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="p-6 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full mt-6" />
              <div className="pt-4">
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="pt-2 flex justify-center">
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Password reset UI
  if (isResetMode) {
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
            <CardHeader className="bg-medical-50 p-6 flex flex-col items-center space-y-4">
              <div className="p-3 rounded-full bg-medical-100">
                {resetComplete ? (
                  <Check className="h-6 w-6 text-medical-600" />
                ) : (
                  <Lock className="h-6 w-6 text-medical-600" />
                )}
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold">
                  {resetComplete ? "Password Updated" : "Reset Your Password"}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {resetComplete 
                    ? "Your password has been successfully updated." 
                    : "Create a new secure password for your account"}
                </p>
              </div>
            </CardHeader>
            
            {resetComplete ? (
              <CardFooter className="flex flex-col space-y-4 p-6">
                <Button 
                  className="w-full" 
                  onClick={() => navigate("/dashboard")}
                >
                  Continue to Dashboard
                </Button>
              </CardFooter>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handlePasswordUpdate)}>
                  <CardContent className="space-y-4 p-6">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input 
                                {...field}
                                type="password" 
                                className="pl-9"
                                placeholder="Create a secure password"
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input 
                                {...field}
                                type="password" 
                                className="pl-9"
                                placeholder="Confirm your password"
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  
                  <CardFooter className="flex flex-col space-y-4 p-6">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading || !form.formState.isValid}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            )}
          </Card>
        </motion.div>
      </div>
    );
  }

  // Regular login/signup UI
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
