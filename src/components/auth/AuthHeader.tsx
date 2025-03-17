
import React from "react";
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface AuthHeaderProps {
  isLogin: boolean;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ isLogin }) => {
  return (
    <CardHeader className="space-y-1 bg-medical-50 p-6">
      <div className="flex justify-center mb-4">
        <div className="h-12 w-12 rounded-full bg-medical-600 flex items-center justify-center">
          <span className="text-white text-lg font-bold">AD</span>
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
  );
};

export default AuthHeader;
