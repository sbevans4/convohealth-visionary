
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ApiKeys {
  googleSpeechApiKey: string | null;
  [key: string]: string | null;
}

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    googleSpeechApiKey: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Fetch API keys from Supabase backend on component mount
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        setIsLoading(true);
        
        // Fetch API keys from the apis table 
        const { data, error: fetchError } = await supabase
          .from('apis')
          .select('name, api_key')
          .eq('status', 'active');
        
        if (fetchError) {
          throw fetchError;
        }
        
        // Process the data into the expected format
        if (data && data.length > 0) {
          const processedKeys: ApiKeys = {
            googleSpeechApiKey: null
          };
          
          // Map API keys to their respective names
          data.forEach(item => {
            if (item.name === 'google_speech_api') {
              processedKeys.googleSpeechApiKey = item.api_key;
            } else {
              // Add any other API keys with their appropriate names
              processedKeys[item.name] = item.api_key;
            }
          });
          
          setApiKeys(processedKeys);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching API keys from Supabase:', err);
        setError('Failed to load API keys. Speech recognition may not work properly.');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only fetch if user is authenticated
    if (user) {
      fetchApiKeys();
    } else {
      setIsLoading(false);
      setError('Authentication required to access API keys');
    }
  }, [user]);
  
  return {
    googleSpeechApiKey: apiKeys.googleSpeechApiKey,
    allApiKeys: apiKeys,
    isLoading,
    error
  };
}
