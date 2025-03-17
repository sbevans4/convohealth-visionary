
import { useState, useRef, useEffect } from "react";
import { TranscriptSegment, SoapNote } from "@/types/medical";
import { createRecorder, processRecording, stopRecorder } from "./recording/recorderManager";

export type ProcessingPhase = 'idle' | 'transcribing' | 'analyzing' | 'generating' | 'complete';

interface UseRecordingOptions {
  onTranscriptionReady?: (transcript: TranscriptSegment[]) => void;
  onSoapNoteReady?: (soapNote: SoapNote) => void;
}

export function useRecording(options?: UseRecordingOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPhase, setProcessingPhase] = useState<ProcessingPhase>('idle');
  const [soapNote, setSoapNote] = useState<SoapNote | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const recorderStateRef = useRef<any>(null);

  const resetRecording = () => {
    setRecordingTime(0);
    setTranscript([]);
    setSoapNote(null);
    setProcessingPhase('idle');
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
      
      // Ensure we stop recording and clean up
      if (recorderStateRef.current && isRecording) {
        stopRecorder(recorderStateRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      resetRecording();
      
      // Create recorder
      const recorderState = await createRecorder();
      if (!recorderState) {
        throw new Error("Failed to create recorder");
      }
      
      recorderStateRef.current = recorderState;
      recorderRef.current = recorderState.mediaRecorder;
      
      // Setup data collection
      audioChunksRef.current = [];
      recorderState.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Setup stop handler
      recorderState.mediaRecorder.onstop = async () => {
        try {
          setIsProcessing(true);
          
          // Process the recording
          const { transcript, soapNote } = await processRecording(audioChunksRef.current, {
            onPhaseChange: (phase) => setProcessingPhase(phase as ProcessingPhase),
            onTranscriptReady: (transcriptData) => {
              setTranscript(transcriptData);
              if (options?.onTranscriptionReady) {
                options.onTranscriptionReady(transcriptData);
              }
            },
            onSoapNoteReady: (soapNoteData) => {
              setSoapNote(soapNoteData);
              if (options?.onSoapNoteReady) {
                options.onSoapNoteReady(soapNoteData);
              }
            }
          });
          
        } catch (error) {
          console.error("Error processing recording:", error);
        } finally {
          setIsProcessing(false);
        }
      };
      
      // Start recording
      recorderState.mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (!recorderRef.current || !isRecording) return;
    
    // Stop the recorder
    recorderRef.current.stop();
    setIsRecording(false);
    
    // Clean up recorder state
    if (recorderStateRef.current) {
      stopRecorder(recorderStateRef.current);
      recorderStateRef.current = null;
    }
    
    // Clear the timer
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return {
    isRecording,
    recordingTime,
    transcript,
    isProcessing,
    processingPhase,
    soapNote,
    startRecording,
    stopRecording,
    resetRecording
  };
}
