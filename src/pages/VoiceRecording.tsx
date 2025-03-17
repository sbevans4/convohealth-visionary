
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Send, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SoapNote } from "@/types/medical";
import { Link } from "react-router-dom";

import RecordingHeader from "@/components/voice-recording/RecordingHeader";
import RecordingControls from "@/components/voice-recording/RecordingControls";
import ProcessingIndicator from "@/components/voice-recording/ProcessingIndicator";
import ResultTabs from "@/components/voice-recording/ResultTabs";
import { ApiKeyManager } from "@/components/voice-recording/ApiKeyManager";
import { useRecording, ProcessingPhase } from "@/hooks/useRecording";
import { useSubscription } from "@/hooks/useSubscription";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const VoiceRecording = () => {
  const [activeTab, setActiveTab] = useState("transcript");
  const { isTrialExpired, trialDaysRemaining, getRecordingMinutesRemaining } = useSubscription();
  
  // Use our custom hook
  const {
    isRecording, 
    recordingTime, 
    transcript, 
    isProcessing,
    processingPhase,
    soapNote,
    startRecording,
    stopRecording,
    resetRecording
  } = useRecording();
  
  // Determine the current recording status
  const getRecordingStatus = (): 'idle' | 'recording' | 'paused' | 'processing' | 'complete' => {
    if (isProcessing) return 'processing';
    if (isRecording) return 'recording';
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
    <div className="space-y-8">
      {/* Header with API Status Indicator */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <RecordingHeader 
          recordingStatus={recordingStatus}
          recordingTime={recordingTime}
          onCopy={() => {
            if (soapNote) {
              const soapText = `SUBJECTIVE:\n${soapNote.subjective}\n\nOBJECTIVE:\n${soapNote.objective}\n\nASSESSMENT:\n${soapNote.assessment}\n\nPLAN:\n${soapNote.plan}`;
              navigator.clipboard.writeText(soapText);
              toast.success("SOAP note copied to clipboard");
            }
          }}
          onSave={() => {
            toast.success("SOAP note saved");
          }}
        />
        <ApiKeyManager />
      </div>

      {/* Trial Expired Alert */}
      {isTrialExpired() && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Trial Expired</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>Your trial period has ended. Upgrade to continue using AI Doctor Notes.</p>
            <Button asChild variant="outline" size="sm" className="self-start mt-2">
              <Link to="/subscription">View Subscription Plans</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Trial Countdown Alert */}
      {!isTrialExpired() && (recordingStatus === 'idle' || recordingStatus === 'recording') && (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <Clock className="h-4 w-4 text-blue-500" />
          <AlertTitle>Trial Mode</AlertTitle>
          <AlertDescription>
            You have {trialDaysRemaining} days and {getRecordingMinutesRemaining().toFixed(1)} minutes of recording remaining in your trial.
          </AlertDescription>
        </Alert>
      )}

      {/* Recording Controls */}
      {!isTrialExpired() && (recordingStatus === 'idle' || recordingStatus === 'recording') && (
        <RecordingControls 
          recordingStatus={recordingStatus}
          recordingTime={recordingTime}
          onStartRecording={startRecording}
          onPauseRecording={() => {}} // Not implementing pause for simplicity
          onResumeRecording={() => {}} // Not implementing resume for simplicity
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
          className="flex justify-center gap-4 pb-8"
        >
          <Button variant="outline" onClick={resetRecording}>
            <RefreshCw className="mr-2 h-4 w-4" />
            New Recording
          </Button>
          
          <Button variant="default" onClick={sendSoapNote}>
            <Send className="mr-2 h-4 w-4" />
            Send SOAP Note
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default VoiceRecording;
