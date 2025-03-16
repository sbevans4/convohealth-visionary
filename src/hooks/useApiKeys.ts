
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
  
  // Fetch API key from backend on component mount
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would be a call to your backend API
        // For now, we'll simulate a backend response
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simulate successful API response
        // In reality, this would be the result of a fetch() call to your backend
        const response = {
          googleSpeechApiKey: "BACKEND_MANAGED_KEY"
        };
        
        setApiKeys(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching API key from backend:', err);
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
