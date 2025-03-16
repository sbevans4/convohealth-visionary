
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Key, Save, Loader2 } from 'lucide-react';

export const ApiKeyAdmin = () => {
  const [apiKey, setApiKey] = useState('');
  const [existingKey, setExistingKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch existing API key on component mount
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('apis')
          .select('api_key')
          .eq('name', 'google_speech_api')
          .eq('status', 'active')
          .single();
        
        if (error) {
          console.log('No existing key found or error:', error);
          setExistingKey(null);
        } else {
          console.log('Found existing key');
          setExistingKey(data.api_key);
          // Mask key except for first 4 characters for display
          const maskedKey = data.api_key.substring(0, 4) + '************************';
          setApiKey(maskedKey);
        }
      } catch (err) {
        console.error('Error fetching API key:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApiKey();
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey || apiKey.includes('*')) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Check if API key already exists
      const { data, error } = await supabase
        .from('apis')
        .select('id')
        .eq('name', 'google_speech_api')
        .single();
      
      if (error) {
        // Key doesn't exist, insert new one
        const { error: insertError } = await supabase
          .from('apis')
          .insert({
            name: 'google_speech_api', 
            api_key: apiKey, 
            status: 'active',
            endpoint: 'https://speech.googleapis.com/v1/speech:recognize' // Add the required endpoint field
          });
        
        if (insertError) throw insertError;
        toast.success('API key saved successfully');
      } else {
        // Key exists, update it
        const { error: updateError } = await supabase
          .from('apis')
          .update({ api_key: apiKey })
          .eq('id', data.id);
        
        if (updateError) throw updateError;
        toast.success('API key updated successfully');
      }
      
      // Mask displayed key
      const maskedKey = apiKey.substring(0, 4) + '************************';
      setApiKey(maskedKey);
      setExistingKey(apiKey);
      
    } catch (err) {
      console.error('Error saving API key:', err);
      toast.error('Error saving API key');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Google Speech API Key
        </CardTitle>
        <CardDescription>
          Configure your Google Speech-to-Text API key for voice transcription
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Google Speech API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isLoading}
              className="font-mono"
            />
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Loading existing key...</span>
              </div>
            )}
            {existingKey && !isLoading && (
              <p className="text-xs text-muted-foreground">
                A key is already configured. Enter a new key to update it.
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveApiKey} 
          disabled={isLoading || isSaving}
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save API Key
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
