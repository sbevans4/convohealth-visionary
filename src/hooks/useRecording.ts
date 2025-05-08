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
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPhase, setProcessingPhase] = useState<ProcessingPhase>('idle');
  const [soapNote, setSoapNote] = useState<SoapNote | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const recorderStateRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  const resetRecording = () => {
    setRecordingTime(0);
    setTranscript([]);
    setSoapNote(null);
    setProcessingPhase('idle');
    setIsPaused(false);
    audioChunksRef.current = [];
    startTimeRef.current = 0;
    accumulatedTimeRef.current = 0;
    if (timerRef.current) {
      window.cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.cancelAnimationFrame(timerRef.current);
        timerRef.current = null;
      }
      
      // Ensure we stop recording and clean up
      if (recorderStateRef.current && isRecording) {
        stopRecorder(recorderStateRef.current);
      }
    };
  }, [isRecording]);

  const startTimer = () => {
    // Clear any existing timer
    if (timerRef.current) {
      window.cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
    
    // Record the current time as the start time
    startTimeRef.current = Date.now();
    
    // Make sure we have a starting value before animations begin
    setRecordingTime(Math.floor(accumulatedTimeRef.current));
    
    // Create a more precise animation-based timer using requestAnimationFrame
    const updateTimer = () => {
      if (!isRecording || isPaused) return; // Don't update if not recording or paused
      
      const now = Date.now();
      const elapsedSinceStart = (now - startTimeRef.current) / 1000;
      const totalTime = accumulatedTimeRef.current + elapsedSinceStart;
      
      // Only update state if time has actually changed (to reduce renders)
      const flooredTotal = Math.floor(totalTime);
      if (flooredTotal !== recordingTime) {
        console.log(`Timer update: ${flooredTotal}s (${recordingTime}s → ${flooredTotal}s)`);
        setRecordingTime(flooredTotal);
      }
      
      // Continue the animation loop
      timerRef.current = window.requestAnimationFrame(updateTimer);
    };
    
    // Start the animation loop immediately
    timerRef.current = window.requestAnimationFrame(updateTimer);
  };
  
  const pauseTimer = () => {
    // Stop the timer
    if (timerRef.current) {
      window.cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
    
    // Calculate and store the accumulated time
    const elapsedSinceStart = (Date.now() - startTimeRef.current) / 1000;
    accumulatedTimeRef.current += elapsedSinceStart;
    // Update one last time to ensure the display is accurate
    const finalTime = Math.floor(accumulatedTimeRef.current);
    console.log(`Timer paused: ${finalTime}s (accumulated: ${accumulatedTimeRef.current})`);
    setRecordingTime(finalTime);
  };

  const startRecording = async () => {
    try {
      console.log("Starting recording...");
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
        if (event.data && event.data.size > 0) {
          console.log(`Received audio chunk: ${event.data.size} bytes`);
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Setup stop handler
      recorderState.mediaRecorder.onstop = async () => {
        try {
          console.log(`Recording stopped with ${audioChunksRef.current.length} chunks and ${recordingTime} seconds`);
          
          if (audioChunksRef.current.length === 0) {
            console.error("No audio data collected. Recording failed.");
            return;
          }
          
          setIsProcessing(true);
          
          // Process the recording
          const { transcript, soapNote } = await processRecording(audioChunksRef.current, {
            onPhaseChange: (phase) => {
              console.log(`Processing phase: ${phase}`);
              setProcessingPhase(phase as ProcessingPhase);
            },
            onTranscriptReady: (transcriptData) => {
              console.log(`Transcript ready with ${transcriptData.length} segments`);
              setTranscript(transcriptData);
              if (options?.onTranscriptionReady) {
                options.onTranscriptionReady(transcriptData);
              }
            },
            onSoapNoteReady: (soapNoteData) => {
              console.log(`SOAP note ready`);
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
      recorderState.mediaRecorder.start(500); // Collect data more frequently (every 500ms)
      console.log("MediaRecorder started");
      setIsRecording(true);
      setIsPaused(false);
      
      // Start timer
      startTimer();
      
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const pauseRecording = () => {
    if (!recorderRef.current || !isRecording || isPaused) return;
    
    // Pause the recorder
    recorderRef.current.pause();
    setIsPaused(true);
    
    // Pause the timer
    pauseTimer();
  };
  
  const resumeRecording = () => {
    if (!recorderRef.current || !isRecording || !isPaused) return;
    
    // Resume the recorder
    recorderRef.current.resume();
    setIsPaused(false);
    
    // Restart the timer from where we left off
    startTimeRef.current = Date.now();
    startTimer();
  };

  const stopRecording = () => {
    if (!recorderRef.current || !isRecording) {
      console.log("Cannot stop recording - recorder not active or not recording");
      return;
    }
    
    console.log("Stopping recording...");
    
    // If paused, update accumulated time before stopping
    if (isPaused) {
      setIsPaused(false);
      // We already updated recordingTime when pausing, so no need to update again
    } else {
      // Calculate and store the final accumulated time
      const elapsedSinceStart = (Date.now() - startTimeRef.current) / 1000;
      accumulatedTimeRef.current += elapsedSinceStart;
      // Update one last time to ensure the display is accurate
      const finalTime = Math.floor(accumulatedTimeRef.current);
      console.log(`Final recording time: ${finalTime}s`);
      setRecordingTime(finalTime);
    }
    
    // Stop the recorder
    try {
      recorderRef.current.stop();
      console.log("MediaRecorder stopped");
    } catch (error) {
      console.error("Error stopping MediaRecorder:", error);
    }
    
    setIsRecording(false);
    
    // Clean up recorder state
    if (recorderStateRef.current) {
      try {
        stopRecorder(recorderStateRef.current);
        recorderStateRef.current = null;
      } catch (error) {
        console.error("Error cleaning up recorder state:", error);
      }
    }
    
    // Clear the timer
    if (timerRef.current) {
      window.cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
  };

  return {
    isRecording,
    isPaused,
    recordingTime,
    transcript,
    isProcessing,
    processingPhase,
    soapNote,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording
  };
}
