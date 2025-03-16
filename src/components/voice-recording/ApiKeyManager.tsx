
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useApiKeys } from '@/hooks/useApiKeys';
import { Key, Info } from 'lucide-react';

export const ApiKeyManager = () => {
  const { googleSpeechApiKey, setGoogleSpeechApiKey, clearGoogleSpeechApiKey } = useApiKeys();
  const [apiKey, setApiKey] = useState('');
  const [open, setOpen] = useState(false);
  
  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }
    
    setGoogleSpeechApiKey(apiKey);
    toast.success('Google Speech API key saved');
    setOpen(false);
  };
  
  const handleClear = () => {
    clearGoogleSpeechApiKey();
    setApiKey('');
    toast.success('Google Speech API key removed');
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Key className="h-4 w-4" />
          {googleSpeechApiKey ? 'API Key Configured' : 'Configure API Key'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Google Speech-to-Text API Key</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <Info className="h-4 w-4 shrink-0" />
            <p>Your API key is stored only in your browser's local storage and is never sent to our servers.</p>
          </div>
          
          <Input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Google Speech-to-Text API key"
            className="w-full"
          />
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleClear} disabled={!googleSpeechApiKey}>
              Clear Key
            </Button>
            <Button onClick={handleSave}>
              Save API Key
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
