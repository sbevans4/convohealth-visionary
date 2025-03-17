
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApiKeyForm from './ApiKeyForm';

export const ApiKeyTabs = () => {
  const [activeTab, setActiveTab] = useState("google");
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="google">Google Speech</TabsTrigger>
        <TabsTrigger value="deepseek">Deepseek AI</TabsTrigger>
      </TabsList>
      
      <TabsContent value="google" className="mt-0">
        <ApiKeyForm 
          keyName="google_speech_api"
          displayName="Google Speech API Key"
          endpoint="https://speech.googleapis.com/v1/speech:recognize"
          description="Configure your Google Speech-to-Text API key for voice transcription"
        />
      </TabsContent>
      
      <TabsContent value="deepseek" className="mt-0">
        <ApiKeyForm 
          keyName="deepseek_api"
          displayName="Deepseek API Key"
          endpoint="https://api.deepseek.com/v1/chat/completions"
          description="Configure your Deepseek API key for SOAP note generation"
        />
      </TabsContent>
    </Tabs>
  );
};

export default ApiKeyTabs;
