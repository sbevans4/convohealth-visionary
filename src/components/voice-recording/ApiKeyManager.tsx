
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useApiKeys } from '@/hooks/useApiKeys';
import { Key, Info, CheckCircle, AlertCircle, Database, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { ApiKeyAdmin } from './ApiKeyAdmin';

export const ApiKeyManager = () => {
  const { googleSpeechApiKey, isLoading, error } = useApiKeys();
  const [open, setOpen] = React.useState(false);
  
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
            <p>The API keys are securely managed in the Supabase backend and automatically used by the application.</p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
              <Settings className="h-3 w-3" />
              API Key Management
            </h3>
            <ApiKeyAdmin />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
