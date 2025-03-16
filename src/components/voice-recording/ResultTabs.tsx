
import React from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranscriptSegment, SoapNote } from "@/types/medical";
import TranscriptTab from "./TranscriptTab";
import SoapNoteTab from "./SoapNoteTab";

interface ResultTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  transcript: TranscriptSegment[];
  soapNote: SoapNote;
  onUpdateSoapNote: (updatedNote: SoapNote) => void;
}

const ResultTabs: React.FC<ResultTabsProps> = ({
  activeTab,
  setActiveTab,
  transcript,
  soapNote,
  onUpdateSoapNote
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="soap">SOAP Note</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transcript" className="mt-0">
          <TranscriptTab transcript={transcript} />
        </TabsContent>
        
        <TabsContent value="soap" className="mt-0">
          <SoapNoteTab 
            soapNote={soapNote} 
            onUpdateSoapNote={onUpdateSoapNote} 
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ResultTabs;
