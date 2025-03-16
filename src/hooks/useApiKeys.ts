
import { useState, useEffect } from 'react';

interface ApiKeys {
  googleSpeechApiKey: string | null;
}

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    googleSpeechApiKey: null
  });
  
  // Load API keys from localStorage on component mount
  useEffect(() => {
    try {
      const storedKeys = localStorage.getItem('api_keys');
      if (storedKeys) {
        setApiKeys(JSON.parse(storedKeys));
      }
    } catch (error) {
      console.error('Error loading API keys from localStorage:', error);
    }
  }, []);
  
  // Save API key to localStorage and state
  const setGoogleSpeechApiKey = (apiKey: string) => {
    const updatedKeys = {
      ...apiKeys,
      googleSpeechApiKey: apiKey
    };
    
    // Update state
    setApiKeys(updatedKeys);
    
    // Save to localStorage
    try {
      localStorage.setItem('api_keys', JSON.stringify(updatedKeys));
    } catch (error) {
      console.error('Error saving API key to localStorage:', error);
    }
  };
  
  // Clear API key from localStorage and state
  const clearGoogleSpeechApiKey = () => {
    const updatedKeys = {
      ...apiKeys,
      googleSpeechApiKey: null
    };
    
    // Update state
    setApiKeys(updatedKeys);
    
    // Save to localStorage
    try {
      localStorage.setItem('api_keys', JSON.stringify(updatedKeys));
    } catch (error) {
      console.error('Error clearing API key from localStorage:', error);
    }
  };
  
  return {
    googleSpeechApiKey: apiKeys.googleSpeechApiKey,
    setGoogleSpeechApiKey,
    clearGoogleSpeechApiKey
  };
}
