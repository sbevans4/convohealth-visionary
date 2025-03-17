
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm, { SignupFormValues } from "@/components/auth/SignupForm";
import ResetPasswordDialog from "@/components/auth/ResetPasswordDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');
  
  // Redirect if already logged in
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleSignup = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            // Store the referral code if present
            referred_by: referralCode
          },
        },
      });

      if (error) throw error;
      
      toast.success("Account created successfully! Please check your email.");
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast.error(error.message || "Error creating account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error logging in:", error);
      toast.error(error.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: referralCode ? {
            referred_by: referralCode
          } : undefined
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      toast.error(error.message || "Error signing in with Google");
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-medical-50/50 p-4"
    >
      <Card className="w-full max-w-md border-0 shadow-lg">
        <AuthHeader />
        
        {referralCode && (
          <div className="px-6 py-2 bg-green-50 border-y border-green-100 text-center">
            <CardDescription className="text-green-700">
              You've been referred by a colleague! You'll get full access, and they'll receive 10% off their next bill.
            </CardDescription>
          </div>
        )}
        
        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full rounded-none border-b">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              onForgotPassword={() => setIsResetPasswordOpen(true)}
              onSwitchToSignup={() => setActiveTab("signup")}
              onGoogleSignIn={handleGoogleSignIn}
            />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignupForm
              onSubmit={handleSignup}
              isLoading={isLoading}
              onSwitchToLogin={() => setActiveTab("login")}
              onGoogleSignIn={handleGoogleSignIn}
            />
          </TabsContent>
        </Tabs>
      </Card>
      
      <ResetPasswordDialog
        open={isResetPasswordOpen}
        onOpenChange={setIsResetPasswordOpen}
      />
    </motion.div>
  );
};

export default Auth;
