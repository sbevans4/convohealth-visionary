import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Send, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SoapNote } from "@/types/medical";

import RecordingHeader from "@/components/voice-recording/RecordingHeader";
import RecordingControls from "@/components/voice-recording/RecordingControls";
import ProcessingIndicator from "@/components/voice-recording/ProcessingIndicator";
import ResultTabs from "@/components/voice-recording/ResultTabs";
import SaveSoapNoteDialog from "@/components/voice-recording/SaveSoapNoteDialog";
import { useRecording, ProcessingPhase } from "@/hooks/useRecording";
import { useSoapNotes } from "@/hooks/useSoapNotes";
import { useNavigate } from "react-router-dom";
import { setupApiKeys } from "@/hooks/recording/recorderManager";

const VoiceRecording = () => {
  const [activeTab, setActiveTab] = useState("transcript");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  // Initialize API keys when component mounts
  useEffect(() => {
    // Set up API keys but handle any errors silently
    setupApiKeys().catch(error => {
      console.error("Failed to initialize API keys:", error);
      // This is non-critical so we don't need to show a toast
    });
  }, []);
  
  // Use our custom hooks
  const {
    isRecording, 
    recordingTime, 
    transcript, 
    isProcessing,
    processingPhase,
    soapNote,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
    isPaused
  } = useRecording();
  
  const { saveSoapNote, isSaving } = useSoapNotes();
  
  // Determine the current recording status
  const getRecordingStatus = (): 'idle' | 'recording' | 'paused' | 'processing' | 'complete' => {
    if (isProcessing) return 'processing';
    if (isRecording) {
      return isPaused ? 'paused' : 'recording';
    }
    if (transcript.length > 0 && soapNote) return 'complete';
    return 'idle';
  };
  
  const recordingStatus = getRecordingStatus();

  // Send the SOAP note to external system
  const sendSoapNote = async () => {
    // In a real application, you would send this to your backend or directly to the EHR system
    // For now, we'll just simulate the API call
    
    toast.loading("Sending SOAP note...");
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful send
      toast.dismiss();
      toast.success("SOAP note sent successfully!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to send SOAP note. Please try again.");
    }
  };
  
  // Handle saving the SOAP note
  const handleSaveSoapNote = async (title: string) => {
    if (!soapNote || transcript.length === 0) {
      toast.error("No SOAP note to save");
      return;
    }
    
    try {
      await saveSoapNote(soapNote, transcript, title, recordingTime);
      toast.success("SOAP note saved! It will be available for 7 days.");
    } catch (error) {
      console.error("Error saving SOAP note:", error);
    }
  };
  
  // Map processing phase to component props
  const mapPhaseToProps = (phase: ProcessingPhase): 'transcribing' | 'analyzing' | 'generating' => {
    switch(phase) {
      case 'transcribing': return 'transcribing';
      case 'analyzing': return 'analyzing';
      case 'generating': return 'generating';
      default: return 'transcribing';
    }
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 md:py-14">
      {/* Header */}
      <RecordingHeader 
        recordingStatus={recordingStatus}
        onCopy={() => {
          if (soapNote) {
            const soapText = `SUBJECTIVE:\n${soapNote.subjective}\n\nOBJECTIVE:\n${soapNote.objective}\n\nASSESSMENT:\n${soapNote.assessment}\n\nPLAN:\n${soapNote.plan}`;
            navigator.clipboard.writeText(soapText);
            toast.success("SOAP note copied to clipboard");
          }
        }}
        onSave={() => {
          setIsSaveDialogOpen(true);
        }}
      />

      {/* Recording Controls */}
      {(recordingStatus === 'idle' || recordingStatus === 'recording' || recordingStatus === 'paused') && (
        <RecordingControls 
          recordingStatus={recordingStatus}
          recordingTime={recordingTime}
          onStartRecording={startRecording}
          onPauseRecording={pauseRecording}
          onResumeRecording={resumeRecording}
          onStopRecording={stopRecording}
        />
      )}

      {/* Processing Animation */}
      {recordingStatus === 'processing' && (
        <ProcessingIndicator currentPhase={mapPhaseToProps(processingPhase)} />
      )}

      {/* Results Tabs - Only show when processing is complete */}
      {recordingStatus === 'complete' && soapNote && (
        <ResultTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          transcript={transcript}
          soapNote={soapNote}
          onUpdateSoapNote={(updatedNote: SoapNote) => {
            // In a real implementation, this would update your state
            toast.success("SOAP note updated");
          }}
        />
      )}

      {/* Action Buttons at Bottom */}
      {recordingStatus === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pb-6 sm:pb-8"
        >
          <Button variant="outline" onClick={resetRecording} className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            New Recording
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setIsSaveDialogOpen(true)}
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            <Save className="mr-2 h-4 w-4" />
            Save (7 days)
          </Button>
          
          <Button variant="default" onClick={sendSoapNote} className="w-full sm:w-auto">
            <Send className="mr-2 h-4 w-4" />
            Send SOAP Note
          </Button>
        </motion.div>
      )}
      
      {/* Save Dialog */}
      <SaveSoapNoteDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        onSave={handleSaveSoapNote}
        defaultTitle={`Patient Consult - ${new Date().toLocaleDateString()}`}
      />
    </div>
  );
};

export default VoiceRecording;
