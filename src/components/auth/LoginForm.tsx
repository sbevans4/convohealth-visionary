
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import LoginFormFields, { LoginFormValues } from "./LoginFormFields";
import ResetPasswordDialog from "./ResetPasswordDialog";

interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => Promise<void>;
  isLoading: boolean;
  onForgotPassword: () => void;
  onSwitchToSignup: () => void;
  onGoogleSignIn: () => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  onSwitchToSignup,
  onGoogleSignIn,
  onForgotPassword,
}) => {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const { handlePasswordReset, resetSent } = useAuth();
  
  const handleResetSubmit = async (email: string) => {
    await handlePasswordReset(email);
  };

  return (
    <>
      <LoginFormFields 
        onSubmit={onSubmit}
        isLoading={isLoading}
        onSwitchToSignup={onSwitchToSignup}
        onGoogleSignIn={onGoogleSignIn}
        onForgotPassword={onForgotPassword}
      />
      
      <ResetPasswordDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        onSubmit={handleResetSubmit}
        isLoading={isLoading}
        resetSent={resetSent}
      />
    </>
  );
};

export default LoginForm;
