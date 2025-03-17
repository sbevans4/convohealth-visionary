
import React from 'react';
import { Info, CheckCircle, AlertCircle, Database } from 'lucide-react';

interface ApiStatusIndicatorProps {
  isLoading: boolean;
  error: string | null;
}

const ApiStatusIndicator = ({ isLoading, error }: ApiStatusIndicatorProps) => {
  return (
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
          <p>LemonFox API is properly configured and ready to use.</p>
        </div>
      )}
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
        <Database className="h-4 w-4 shrink-0" />
        <p>The API keys are securely managed in the Supabase backend and automatically used by the application.</p>
      </div>
    </div>
  );
};

export default ApiStatusIndicator;
