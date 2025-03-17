
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useApiKeys } from '@/hooks/useApiKeys';
import { Key, Settings } from 'lucide-react';
import ApiStatusIndicator from './ApiStatusIndicator';
import ApiKeyTabs from './ApiKeyTabs';

export const ApiKeyManager = () => {
  const { isLoading, error } = useApiKeys();
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
        
        <ApiStatusIndicator isLoading={isLoading} error={error} />
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Settings className="h-3 w-3" />
            API Key Management
          </h3>
          <ApiKeyTabs />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyManager;
