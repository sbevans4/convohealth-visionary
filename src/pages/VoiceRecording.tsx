
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TranscriptSegment, SoapNote } from "@/types/medical";

import RecordingHeader from "@/components/voice-recording/RecordingHeader";
import RecordingControls from "@/components/voice-recording/RecordingControls";
import ProcessingIndicator from "@/components/voice-recording/ProcessingIndicator";
import ResultTabs from "@/components/voice-recording/ResultTabs";

const VoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'paused' | 'processing' | 'complete'>('idle');
  const [activeTab, setActiveTab] = useState("transcript");
  const { toast } = useToast();
  
  // Mock transcript data
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  
  // Mock SOAP note
  const [soapNote, setSoapNote] = useState<SoapNote>({
    subjective: "",
    objective: "",
    assessment: "",
    plan: ""
  });
  
  // Timer effect
  useEffect(() => {
    let interval: number | null = null;
    
    if (isRecording && !isPaused) {
      interval = window.setInterval(() => {
        setRecordingTime((time) => time + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, isPaused]);
  
  // Start recording
  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingStatus('recording');
    toast({
      title: "Recording started",
      description: "Your voice is now being recorded",
    });
  };
  
  // Pause recording
  const pauseRecording = () => {
    setIsPaused(true);
    setRecordingStatus('paused');
    toast({
      title: "Recording paused",
      description: "You can resume at any time",
    });
  };
  
  // Resume recording
  const resumeRecording = () => {
    setIsPaused(false);
    setRecordingStatus('recording');
    toast({
      title: "Recording resumed",
      description: "Continuing your session",
    });
  };
  
  // Stop recording and process
  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingStatus('processing');
    toast({
      title: "Processing recording",
      description: "Please wait while we analyze your conversation",
    });
    
    // Simulate processing delay
    setTimeout(() => {
      // Generate mock transcript
      const mockTranscript: TranscriptSegment[] = [
        {
          id: "1",
          speaker: "Doctor",
          text: "Hello Mrs. Johnson, how are you feeling today?",
          startTime: 0,
          endTime: 4,
          confidence: 0.95
        },
        {
          id: "2",
          speaker: "Patient",
          text: "I've been having this persistent headache for the past week, and over-the-counter pain medications aren't helping much.",
          startTime: 5,
          endTime: 12,
          confidence: 0.92
        },
        {
          id: "3",
          speaker: "Doctor",
          text: "I'm sorry to hear that. Can you describe the pain? Is it constant or does it come and go?",
          startTime: 13,
          endTime: 18,
          confidence: 0.97
        },
        {
          id: "4",
          speaker: "Patient",
          text: "It's mostly constant, but gets worse in the afternoon and evening. It feels like pressure behind my eyes and across my forehead.",
          startTime: 19,
          endTime: 28,
          confidence: 0.94
        },
        {
          id: "5",
          speaker: "Doctor",
          text: "Have you noticed any triggers that make it worse? Like certain foods, stress, or changes in your routine?",
          startTime: 29,
          endTime: 35,
          confidence: 0.96
        },
        {
          id: "6",
          speaker: "Patient",
          text: "Well, I've been working longer hours lately and staring at my computer screen more than usual. I also haven't been sleeping well.",
          startTime: 36,
          endTime: 44,
          confidence: 0.93
        },
        {
          id: "7",
          speaker: "Doctor",
          text: "I see. Have you experienced any other symptoms along with the headache? Any nausea, vision changes, or sensitivity to light?",
          startTime: 45,
          endTime: 52,
          confidence: 0.95
        }
      ];
      
      // Generate mock SOAP note
      const mockSoapNote: SoapNote = {
        subjective: "45-year-old female presents with persistent headache for the past week. Patient reports constant pain that worsens in the afternoon and evening, described as pressure behind the eyes and across the forehead. OTC pain medications have provided minimal relief. Patient has been working longer hours recently with increased screen time and reports poor sleep quality.",
        objective: "Vital signs stable. Alert and oriented x3. No visible distress. HEENT: PERRL, EOMI, no sinus tenderness on palpation. Neck: Supple, mild trapezius muscle tightness bilaterally. Neurological: CN II-XII intact, no focal deficits.",
        assessment: "Tension headache, likely related to increased occupational stress, poor ergonomics, and sleep disturbance. Differential diagnosis includes migraine, cervicogenic headache, and sinusitis.",
        plan: "1. Recommended ergonomic adjustments to workstation and regular screen breaks\n2. Prescribed cyclobenzaprine 10mg QHS for 1 week for muscle tension\n3. Sleep hygiene education provided\n4. Encouraged adequate hydration and regular meals\n5. Return in 2 weeks if symptoms persist or worsen\n6. Consider referral to neurology if no improvement with current management"
      };
      
      setTranscript(mockTranscript);
      setSoapNote(mockSoapNote);
      setRecordingStatus('complete');
      setActiveTab("soap");
      
      toast({
        title: "Processing complete",
        description: "Your transcript and SOAP note are ready",
      });
    }, 3000);
  };
  
  // Reset recording
  const resetRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setRecordingStatus('idle');
    setTranscript([]);
    setSoapNote({
      subjective: "",
      objective: "",
      assessment: "",
      plan: ""
    });
    setActiveTab("transcript");
    
    toast({
      title: "Recording reset",
      description: "All data has been cleared. Ready for a new recording.",
    });
  };
  
  // Copy SOAP note to clipboard
  const copySoapNote = () => {
    const soapText = `SUBJECTIVE:\n${soapNote.subjective}\n\nOBJECTIVE:\n${soapNote.objective}\n\nASSESSMENT:\n${soapNote.assessment}\n\nPLAN:\n${soapNote.plan}`;
    
    navigator.clipboard.writeText(soapText).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "SOAP note has been copied to your clipboard",
      });
    });
  };
  
  // Save recording (mock function)
  const saveRecording = () => {
    toast({
      title: "Recording saved",
      description: "Your session has been saved successfully",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <RecordingHeader 
        recordingStatus={recordingStatus}
        recordingTime={recordingTime}
        onCopy={copySoapNote}
        onSave={saveRecording}
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
      {recordingStatus === 'processing' && <ProcessingIndicator />}

      {/* Results Tabs - Only show when processing is complete */}
      {recordingStatus === 'complete' && (
        <ResultTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          transcript={transcript}
          soapNote={soapNote}
          onUpdateSoapNote={setSoapNote}
        />
      )}

      {/* Action Buttons at Bottom */}
      {recordingStatus === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex justify-center pb-8"
        >
          <Button variant="outline" onClick={resetRecording}>
            <RefreshCw className="mr-2 h-4 w-4" />
            New Recording
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default VoiceRecording;
