
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CardContent,
  CardFooter,
} from "@/components/ui/card";

// Form validation schema with detailed error messages
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address (e.g., doctor@example.com)"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormFieldsProps {
  onSubmit: (data: LoginFormValues) => Promise<void>;
  isLoading: boolean;
  onSwitchToSignup: () => void;
  onGoogleSignIn: () => Promise<void>;
  onForgotPassword: () => void;
}

const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
  onSubmit,
  isLoading,
  onSwitchToSignup,
  onGoogleSignIn,
  onForgotPassword,
}) => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", // Enable real-time validation as user types
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 p-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="doctor@example.com" 
                      className="pl-9"
                      type="email"
                      aria-describedby="email-validation"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage id="email-validation" />
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <button 
                    type="button"
                    className="text-xs text-medical-600 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      onForgotPassword();
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input 
                      {...field}
                      type="password" 
                      className="pl-9"
                      aria-describedby="password-validation"
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage id="password-validation" />
                </div>
              </FormItem>
            )}
          />
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 bg-background border-t p-6">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !form.formState.isValid}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
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
            onClick={onGoogleSignIn}
            disabled={isLoading}
          >
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="h-4 w-4 mr-2" />
            Sign in with Google
          </Button>
          
          <div className="text-center text-sm">
            <p>
              Don't have an account?{" "}
              <button 
                type="button"
                className="text-medical-600 hover:underline font-medium"
                onClick={onSwitchToSignup}
              >
                Sign up
              </button>
            </p>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
};

export default LoginFormFields;
