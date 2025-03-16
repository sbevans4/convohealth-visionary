
import { useState, useRef, useEffect } from "react";
import { TranscriptSegment, SoapNote } from "@/types/medical";
import { RecordingState, ProcessingPhase, UseRecordingOptions } from "./recording/types";
import { createRecorder, stopRecorder, processRecording, RecorderState } from "./recording/recorderManager";

export { ProcessingPhase } from "./recording/types";

export function useRecording(options?: UseRecordingOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPhase, setProcessingPhase] = useState<ProcessingPhase>('idle');
  const [soapNote, setSoapNote] = useState<SoapNote | null>(null);
  const recorderStateRef = useRef<RecorderState | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

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
      if (recorderStateRef.current) {
        stopRecorder(recorderStateRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      resetRecording();
      
      // Create the recorder
      const recorderState = await createRecorder();
      if (!recorderState) return;
      
      recorderStateRef.current = recorderState;
      const { mediaRecorder } = recorderState;
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        try {
          setIsProcessing(true);
          
          // Process the recording
          const result = await processRecording(
            audioChunksRef.current, 
            {
              onTranscriptReady: (transcriptResult) => {
                setTranscript(transcriptResult);
                if (options?.onTranscriptionReady) {
                  options.onTranscriptionReady(transcriptResult);
                }
              },
              onSoapNoteReady: (generatedSoapNote) => {
                setSoapNote(generatedSoapNote);
                if (options?.onSoapNoteReady) {
                  options.onSoapNoteReady(generatedSoapNote);
                }
              },
              onPhaseChange: (phase) => {
                setProcessingPhase(phase as ProcessingPhase);
              }
            }
          );
          
        } catch (error) {
          console.error("Error processing recording:", error);
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
    }
  };

  const stopRecording = () => {
    if (!recorderStateRef.current?.mediaRecorder || !isRecording) return;
    
    // Stop the recorder
    recorderStateRef.current.mediaRecorder.stop();
    setIsRecording(false);
    
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
