
import React from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/utils/formatters";

interface RecordingControlsProps {
  recordingStatus: 'idle' | 'recording' | 'paused' | 'processing' | 'complete';
  recordingTime: number;
  onStartRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onStopRecording: () => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  recordingStatus,
  recordingTime,
  onStartRecording,
  onPauseRecording,
  onResumeRecording,
  onStopRecording
}) => {
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
              {formatDuration(recordingTime)}
            </div>
          )}
          
          <div className="flex items-center gap-4">
            {recordingStatus === 'idle' && (
              <Button size="lg" onClick={onStartRecording} className="px-8">
                <Mic className="mr-2 h-5 w-5" />
                Start Recording
              </Button>
            )}
            
            {recordingStatus === 'recording' && (
              <>
                <Button size="lg" variant="outline" onClick={onPauseRecording}>
                  <Pause className="mr-2 h-5 w-5" />
                  Pause
                </Button>
                <Button size="lg" variant="destructive" onClick={onStopRecording}>
                  <MicOff className="mr-2 h-5 w-5" />
                  Stop Recording
                </Button>
              </>
            )}
            
            {recordingStatus === 'paused' && (
              <>
                <Button size="lg" variant="outline" onClick={onResumeRecording}>
                  <Play className="mr-2 h-5 w-5" />
                  Resume
                </Button>
                <Button size="lg" variant="destructive" onClick={onStopRecording}>
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

export default RecordingControls;
