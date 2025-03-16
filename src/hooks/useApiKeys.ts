
import { useState, useEffect } from 'react';

interface ApiKeys {
  googleSpeechApiKey: string | null;
}

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    googleSpeechApiKey: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch API key from Supabase backend on component mount
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        setIsLoading(true);
        // In production, this would be a call to your Supabase function
        // For example: const { data, error } = await supabaseClient.functions.invoke('get-api-keys')
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simulate successful API response from Supabase
        const response = {
          googleSpeechApiKey: "SUPABASE_MANAGED_KEY"
        };
        
        setApiKeys(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching API key from Supabase:', err);
        setError('Failed to load API key. Speech recognition may not work properly.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApiKey();
  }, []);
  
  return {
    googleSpeechApiKey: apiKeys.googleSpeechApiKey,
    isLoading,
    error
  };
}
