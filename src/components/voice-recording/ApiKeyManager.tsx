
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useApiKeys } from '@/hooks/useApiKeys';
import { Key, Info, CheckCircle, AlertCircle, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const ApiKeyManager = () => {
  const { googleSpeechApiKey, isLoading, error } = useApiKeys();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  
  // Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  
  React.useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    // Set up listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const handleAuthRedirect = () => {
    toast.info("You need to sign in to access this feature");
    navigate("/auth");
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Key className="h-4 w-4" />
          {isLoading ? 'Loading API Status...' : 
           error ? 'API Configuration Error' : 
           'API Connected'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Speech Recognition API Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!isAuthenticated && (
            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <div className="flex-1">
                <p>You need to be signed in to access API services.</p>
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-amber-700 dark:text-amber-400" 
                  onClick={handleAuthRedirect}
                >
                  Sign in now
                </Button>
              </div>
            </div>
          )}
        
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
              <Info className="h-4 w-4 shrink-0 animate-spin" />
              <p>Checking API connection status...</p>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 p-3 rounded-md">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 p-3 rounded-md">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <p>Speech recognition API is properly configured and ready to use.</p>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <Database className="h-4 w-4 shrink-0" />
            <p>The API key is securely managed in your Supabase backend. No client-side configuration is needed.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
