
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApiKeyForm from './ApiKeyForm';

export const ApiKeyTabs = () => {
  const [activeTab, setActiveTab] = useState("lemonfox");
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="lemonfox">LemonFox API</TabsTrigger>
        <TabsTrigger value="deepseek">Deepseek AI</TabsTrigger>
      </TabsList>
      
      <TabsContent value="lemonfox" className="mt-0">
        <ApiKeyForm 
          keyName="lemonfox_api"
          displayName="LemonFox API Key"
          endpoint="https://api.lemonfox.ai/v1/transcribe"
          description="Configure your LemonFox API key for voice transcription"
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
