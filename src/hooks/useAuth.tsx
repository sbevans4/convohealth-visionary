
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { LoginFormValues } from "@/components/auth/LoginForm";
import type { SignupFormValues } from "@/components/auth/SignupForm";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  // Handle login submission
  const handleLogin = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      
      toast.success("Successfully signed in!");
      navigate("/dashboard");
    } catch (error: any) {
      // More user-friendly error messages
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Incorrect email or password. Please try again.");
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("Please verify your email address before signing in.");
      } else {
        toast.error(error.message || "Failed to sign in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup submission
  const handleSignup = async (data: SignupFormValues) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (error) throw error;
      
      toast.success("Account created successfully! Please check your email to confirm your account.");
      return true;
    } catch (error: any) {
      // More specific error messages for signup
      if (error.message.includes("User already registered")) {
        toast.error("An account with this email already exists. Try signing in instead.");
      } else if (error.message.includes("rate limit")) {
        toast.error("Too many attempts. Please try again later.");
      } else {
        toast.error(error.message || "Failed to create account");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset request
  const handlePasswordReset = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (error) throw error;
      
      setResetSent(true);
      toast.success("Password reset link sent to your email.");
      return true;
    } catch (error: any) {
      if (error.message.includes("rate limit")) {
        toast.error("Too many password reset attempts. Please try again later.");
      } else {
        toast.error(error.message || "Failed to send password reset email.");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle password update (after reset)
  const handleUpdatePassword = async (password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      toast.success("Password updated successfully!");
      navigate("/dashboard");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to update password.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social login
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    resetSent,
    handleLogin,
    handleSignup,
    handlePasswordReset,
    handleUpdatePassword,
    handleGoogleSignIn
  };
};
