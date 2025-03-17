
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ApiKeys {
  lemonfoxApiKey: string | null;
  deepseekApiKey: string | null;
  [key: string]: string | null;
}

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    lemonfoxApiKey: null,
    deepseekApiKey: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
            lemonfoxApiKey: null,
            deepseekApiKey: null
          };
          
          // Map API keys to their respective names
          data.forEach(item => {
            if (item.name === 'lemonfox_api') {
              processedKeys.lemonfoxApiKey = item.api_key;
            } else if (item.name === 'deepseek_api') {
              processedKeys.deepseekApiKey = item.api_key;
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
    
    // Fetch API keys on component mount without requiring user authentication
    fetchApiKeys();
  }, []);
  
  return {
    lemonfoxApiKey: apiKeys.lemonfoxApiKey,
    deepseekApiKey: apiKeys.deepseekApiKey,
    allApiKeys: apiKeys,
    isLoading,
    error
  };
}
