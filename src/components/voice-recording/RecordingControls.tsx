import React, { memo, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RecordingControlsProps {
  recordingStatus: 'idle' | 'recording' | 'paused' | 'processing' | 'complete';
  recordingTime: number;
  onStartRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onStopRecording: () => void;
}

// Format the recording time (seconds) to MM:SS - moved outside component to prevent recreation
const formatTime = (seconds: number): string => {
  // Handle potential invalid values
  const validSeconds = isNaN(seconds) ? 0 : Math.max(0, seconds);
  
  const minutes = Math.floor(validSeconds / 60);
  const remainingSeconds = Math.floor(validSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const RecordingControls: React.FC<RecordingControlsProps> = ({
  recordingStatus,
  recordingTime,
  onStartRecording,
  onPauseRecording,
  onResumeRecording,
  onStopRecording
}) => {
  // Keep track of previous time for debugging
  const prevTimeRef = useRef(recordingTime);
  
  // Use local state to ensure updates are reflected in the UI
  const [displayTime, setDisplayTime] = useState(formatTime(recordingTime));
  
  // Internal timer for fallback (in case the external timer fails)
  const internalTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const [internalTime, setInternalTime] = useState(0);
  
  // Update the display time whenever recordingTime changes
  useEffect(() => {
    if (recordingTime !== prevTimeRef.current) {
      console.log(`RecordingControls: Time updated from ${prevTimeRef.current}s to ${recordingTime}s`);
      prevTimeRef.current = recordingTime;
    }
    
    setDisplayTime(formatTime(recordingTime));
  }, [recordingTime]);
  
  // Start an internal timer as a fallback when recording
  useEffect(() => {
    if (recordingStatus === 'recording') {
      // Clear any existing timer
      if (internalTimerRef.current) {
        cancelAnimationFrame(internalTimerRef.current);
        internalTimerRef.current = null;
      }
      
      // Set starting time
      startTimeRef.current = Date.now();
      setInternalTime(recordingTime);
      
      // Create update function for animation frame
      const updateInternalTimer = () => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const newTime = recordingTime + Math.floor(elapsed);
        
        if (newTime !== internalTime) {
          setInternalTime(newTime);
        }
        
        internalTimerRef.current = requestAnimationFrame(updateInternalTimer);
      };
      
      // Start the timer
      internalTimerRef.current = requestAnimationFrame(updateInternalTimer);
      
      // Cleanup function
      return () => {
        if (internalTimerRef.current) {
          cancelAnimationFrame(internalTimerRef.current);
          internalTimerRef.current = null;
        }
      };
    } else if (internalTimerRef.current) {
      // Stop the timer if not recording
      cancelAnimationFrame(internalTimerRef.current);
      internalTimerRef.current = null;
    }
  }, [recordingStatus, recordingTime]);
  
  // Determine which time to display
  const timeToDisplay = recordingTime > 0 ? displayTime : formatTime(internalTime);

  return (
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
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse"></div>
            )}
            <div 
              className={cn(
                "h-24 w-24 rounded-full flex items-center justify-center border-4 transition-all",
                recordingStatus === 'recording' 
                  ? "border-red-500 bg-red-50"
                  : recordingStatus === 'paused'
                    ? "border-amber-500 bg-amber-50"
                    : "border-blue-500 bg-blue-50"
              )}
            >
              {recordingStatus === 'idle' && (
                <Mic className="h-10 w-10 text-blue-600" />
              )}
              {recordingStatus === 'recording' && (
                <Mic className="h-10 w-10 text-red-600" />
              )}
              {recordingStatus === 'paused' && (
                <Play className="h-10 w-10 text-amber-600" />
              )}
            </div>
          </div>
          
          {recordingStatus !== 'idle' && (
            <div className="text-3xl font-mono font-semibold mb-8 tracking-widest">
              {timeToDisplay}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
  {recordingStatus === 'idle' && (
    <Button 
      size="lg" 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onStartRecording();
      }} 
      className="px-8 w-full sm:w-auto"
    >
      <Mic className="mr-2 h-5 w-5" />
      Start Recording
    </Button>
  )}
  
  {recordingStatus === 'recording' && (
    <>
      <Button 
        size="lg" 
        variant="outline" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onPauseRecording();
        }}
        className="w-full sm:w-auto"
      >
        <Pause className="mr-2 h-5 w-5" />
        Pause
      </Button>
      <Button 
        size="lg" 
        variant="destructive" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onStopRecording();
        }}
        className="w-full sm:w-auto"
      >
        <MicOff className="mr-2 h-5 w-5" />
        Stop Recording
      </Button>
    </>
  )}

  {recordingStatus === 'paused' && (
    <>
      <Button 
        size="lg" 
        variant="outline" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onResumeRecording();
        }}
        className="w-full sm:w-auto"
      >
        <Play className="mr-2 h-5 w-5" />
        Resume
      </Button>
      <Button 
        size="lg" 
        variant="destructive" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onStopRecording();
        }}
        className="w-full sm:w-auto"
      >
        <MicOff className="mr-2 h-5 w-5" />
        Stop Recording
      </Button>
    </>
  )}
</div>

        </CardContent>
      </Card>
    </motion.div>
  );
};

// Use memo to prevent unnecessary re-renders when other props haven't changed
export default memo(RecordingControls);
