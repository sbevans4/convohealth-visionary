
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Pause,
  Play,
  RefreshCw,
  Loader2,
  Clock,
  Save,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TranscriptSegment, SoapNote } from "@/types/medical";
import { useToast } from "@/components/ui/use-toast";

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
  
  // Format time as MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-display font-semibold tracking-tight">Voice Recording</h1>
          <p className="text-muted-foreground">
            Record and transcribe patient conversations automatically
          </p>
        </motion.div>
        
        {recordingStatus === 'complete' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <Button variant="outline" size="sm" onClick={copySoapNote}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="default" size="sm" onClick={saveRecording}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </motion.div>
        )}
      </div>

      {/* Session Information */}
      {(recordingStatus !== 'idle' && recordingStatus !== 'recording' && recordingStatus !== 'paused') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border shadow-soft bg-background">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Input 
                      value="Patient Encounter - Jane Doe" 
                      className="border-none text-lg font-medium p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0" 
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3.5 w-3.5" />
                      {new Date().toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Duration: {formatTime(recordingTime)}
                    </div>
                  </div>
                </div>
                {recordingStatus === 'complete' && (
                  <div className="flex items-center mt-4 md:mt-0">
                    <div className="bg-green-100 text-green-700 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium">
                      <Check className="h-3.5 w-3.5" />
                      Processing Complete
                    </div>
                  </div>
                )}
                {recordingStatus === 'processing' && (
                  <div className="flex items-center mt-4 md:mt-0">
                    <div className="bg-blue-100 text-blue-700 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Processing Audio
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recording Controls */}
      {(recordingStatus === 'idle' || recordingStatus === 'recording' || recordingStatus === 'paused') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-center"
        >
          <Card className="border shadow-soft bg-background max-w-xl w-full">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-2">
                  {recordingStatus === 'idle' ? "Ready to Record" : 
                   recordingStatus === 'paused' ? "Recording Paused" : "Recording in Progress"}
                </h2>
                <p className="text-muted-foreground">
                  {recordingStatus === 'idle' ? "Click the microphone button to start" : 
                   recordingStatus === 'paused' ? "Click resume to continue recording" : 
                   "Capturing audio from your conversation"}
                </p>
              </div>
              
              <div className="relative mb-8">
                {recordingStatus === 'recording' && (
                  <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse-soft"></div>
                )}
                <div 
                  className={cn(
                    "h-24 w-24 rounded-full flex items-center justify-center border-4 transition-all",
                    recordingStatus === 'recording' 
                      ? "border-red-500 bg-red-50"
                      : recordingStatus === 'paused'
                        ? "border-amber-500 bg-amber-50"
                        : "border-medical-500 bg-medical-50"
                  )}
                >
                  {recordingStatus === 'idle' && (
                    <Mic className="h-10 w-10 text-medical-600" />
                  )}
                  {recordingStatus === 'recording' && (
                    <MicOff className="h-10 w-10 text-red-600" />
                  )}
                  {recordingStatus === 'paused' && (
                    <Play className="h-10 w-10 text-amber-600" />
                  )}
                </div>
              </div>
              
              {recordingStatus !== 'idle' && (
                <div className="text-3xl font-mono font-semibold mb-8 tracking-widest">
                  {formatTime(recordingTime)}
                </div>
              )}
              
              <div className="flex items-center gap-4">
                {recordingStatus === 'idle' && (
                  <Button size="lg" onClick={startRecording} className="px-8">
                    <Mic className="mr-2 h-5 w-5" />
                    Start Recording
                  </Button>
                )}
                
                {recordingStatus === 'recording' && (
                  <>
                    <Button size="lg" variant="outline" onClick={pauseRecording}>
                      <Pause className="mr-2 h-5 w-5" />
                      Pause
                    </Button>
                    <Button size="lg" variant="destructive" onClick={stopRecording}>
                      <MicOff className="mr-2 h-5 w-5" />
                      Stop Recording
                    </Button>
                  </>
                )}
                
                {recordingStatus === 'paused' && (
                  <>
                    <Button size="lg" variant="outline" onClick={resumeRecording}>
                      <Play className="mr-2 h-5 w-5" />
                      Resume
                    </Button>
                    <Button size="lg" variant="destructive" onClick={stopRecording}>
                      <MicOff className="mr-2 h-5 w-5" />
                      Stop Recording
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Processing Animation */}
      {recordingStatus === 'processing' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-center py-12"
        >
          <div className="text-center">
            <div className="flex flex-col items-center">
              <Loader2 className="h-16 w-16 text-medical-500 animate-spin mb-6" />
              <h3 className="text-xl font-semibold mb-2">Processing Your Recording</h3>
              <p className="text-muted-foreground mb-8 max-w-md">
                We're transcribing your conversation and generating a SOAP note. This usually takes about 30 seconds.
              </p>
              <div className="h-2 w-64 bg-medical-100 rounded-full overflow-hidden">
                <div className="h-full bg-medical-500 rounded-full animate-pulse" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Tabs - Only show when processing is complete */}
      {recordingStatus === 'complete' && (
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
              <Card className="border shadow-soft">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {transcript.map((segment) => (
                      <div key={segment.id} className="flex gap-4">
                        <div className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium h-fit",
                          segment.speaker === "Doctor" 
                            ? "bg-medical-100 text-medical-800" 
                            : "bg-green-100 text-green-800"
                        )}>
                          {segment.speaker}
                        </div>
                        <div className="flex-1">
                          <p className="text-base leading-relaxed">{segment.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="soap" className="mt-0">
              <Card className="border shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">SOAP Note</h3>
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      AI Generated
                    </div>
                  </div>
                  
                  <Accordion type="single" collapsible defaultValue="subjective" className="w-full">
                    <AccordionItem value="subjective">
                      <AccordionTrigger className="text-base font-medium">
                        Subjective
                      </AccordionTrigger>
                      <AccordionContent>
                        <Textarea 
                          value={soapNote.subjective} 
                          onChange={(e) => setSoapNote({...soapNote, subjective: e.target.value})}
                          className="min-h-24 resize-none"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="objective">
                      <AccordionTrigger className="text-base font-medium">
                        Objective
                      </AccordionTrigger>
                      <AccordionContent>
                        <Textarea 
                          value={soapNote.objective} 
                          onChange={(e) => setSoapNote({...soapNote, objective: e.target.value})}
                          className="min-h-24 resize-none"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="assessment">
                      <AccordionTrigger className="text-base font-medium">
                        Assessment
                      </AccordionTrigger>
                      <AccordionContent>
                        <Textarea 
                          value={soapNote.assessment} 
                          onChange={(e) => setSoapNote({...soapNote, assessment: e.target.value})}
                          className="min-h-24 resize-none"
                        />
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="plan">
                      <AccordionTrigger className="text-base font-medium">
                        Plan
                      </AccordionTrigger>
                      <AccordionContent>
                        <Textarea 
                          value={soapNote.plan} 
                          onChange={(e) => setSoapNote({...soapNote, plan: e.target.value})}
                          className="min-h-24 resize-none"
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
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
