
import { useState, useRef, useEffect } from "react";
import { TranscriptSegment } from "@/types/medical";
import { toast } from "sonner";
import { isPlatform } from "@/utils/platformUtils";

interface UseRecordingOptions {
  onTranscriptionReady?: (transcript: TranscriptSegment[]) => void;
}

export function useRecording(options?: UseRecordingOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const resetRecording = () => {
    setRecordingTime(0);
    setTranscript([]);
    audioChunksRef.current = [];
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      resetRecording();
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        try {
          setIsProcessing(true);
          // Combine audio chunks into a single blob
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Simulate transcription processing with mock data
          await simulateTranscriptionProcessing(audioBlob);
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
          
        } catch (error) {
          console.error("Error processing recording:", error);
          toast.error("Failed to process recording");
        } finally {
          setIsProcessing(false);
        }
      };
      
      // Start recording
      mediaRecorder.start(1000);
      setIsRecording(true);
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to access microphone");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;
    
    // Stop the recorder
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    
    // Clear the timer
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // This function simulates the transcription process for development
  const simulateTranscriptionProcessing = async (audioBlob: Blob) => {
    // In a real app, you would send the audio to a transcription service
    // For now, we'll simulate with mock data
    console.log("Processing audio blob:", audioBlob);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create mock transcript segments
    const mockTranscript: TranscriptSegment[] = [
      {
        id: "1",
        speaker: "Doctor",
        text: "Hello, how are you feeling today?",
        startTime: 0,
        endTime: 3.5,
        confidence: 0.95
      },
      {
        id: "2",
        speaker: "Patient",
        text: "I've been having headaches and some dizziness for the past week.",
        startTime: 4.0,
        endTime: 9.0,
        confidence: 0.92
      },
      {
        id: "3",
        speaker: "Doctor",
        text: "I see. Is the headache constant or does it come and go?",
        startTime: 10.0,
        endTime: 14.5,
        confidence: 0.97
      },
      {
        id: "4",
        speaker: "Patient",
        text: "It comes and goes. Usually worse in the morning.",
        startTime: 15.0,
        endTime: 19.0,
        confidence: 0.94
      }
    ];
    
    setTranscript(mockTranscript);
    
    // Notify through callback if provided
    if (options?.onTranscriptionReady) {
      options.onTranscriptionReady(mockTranscript);
    }
    
    toast.success("Transcription completed");
  };

  return {
    isRecording,
    recordingTime,
    transcript,
    isProcessing,
    startRecording,
    stopRecording,
    resetRecording
  };
}
