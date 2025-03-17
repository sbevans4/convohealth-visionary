
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, Loader2 } from "lucide-react";
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

// Form validation schema
const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSubmit: (data: SignupFormValues) => Promise<void>;
  isLoading: boolean;
  onSwitchToLogin: () => void;
  onGoogleSignIn: () => Promise<void>;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  isLoading,
  onSwitchToLogin,
  onGoogleSignIn,
}) => {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 p-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="Dr. John Smith" 
                      className="pl-9"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          
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
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input 
                      {...field}
                      type="password" 
                      className="pl-9"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 bg-background border-t p-6">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
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
            Sign up with Google
          </Button>
          
          <div className="text-center text-sm">
            <p>
              Already have an account?{" "}
              <button 
                type="button"
                className="text-medical-600 hover:underline font-medium"
                onClick={onSwitchToLogin}
              >
                Sign in
              </button>
            </p>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
};

export default SignupForm;
