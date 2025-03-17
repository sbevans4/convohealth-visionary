
import React from 'react';
import { Info, CheckCircle, AlertCircle, Database } from 'lucide-react';
import { useApiKeys } from '@/hooks/useApiKeys';

interface ApiStatusIndicatorProps {
  isLoading: boolean;
  error: string | null;
}

const ApiStatusIndicator = ({ isLoading, error }: ApiStatusIndicatorProps) => {
  const { lemonfoxApiKey, deepseekApiKey } = useApiKeys();
  
  // Mask API keys for display - show only first 4 characters
  const maskApiKey = (key: string | null) => {
    if (!key) return null;
    return key.substring(0, 4) + '*********************';
  };
  
  const maskedLemonFoxKey = maskApiKey(lemonfoxApiKey);
  const maskedDeepseekKey = maskApiKey(deepseekApiKey);
  
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
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 p-3 rounded-md">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <p>
              {lemonfoxApiKey 
                ? `LemonFox API is properly configured with key "${maskedLemonFoxKey}" and ready to use.`
                : "LemonFox API key not found. Please configure it."}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 p-3 rounded-md">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <p>
              {deepseekApiKey
                ? "Deepseek API is configured and ready for generating SOAP notes."
                : "Deepseek API key not found. Please configure it."}
            </p>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
        <Database className="h-4 w-4 shrink-0" />
        <p>API keys are securely stored and automatically used for transcription and SOAP note generation.</p>
      </div>
    </div>
  );
};

export default ApiStatusIndicator;
