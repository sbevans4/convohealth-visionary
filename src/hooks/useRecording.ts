
import { useState, useRef, useEffect } from "react";
import { TranscriptSegment, SoapNote } from "@/types/medical";

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
      if (recorderRef.current && isRecording) {
        recorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      resetRecording();
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create recorder
      const mediaRecorder = new MediaRecorder(stream);
      recorderRef.current = mediaRecorder;
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        try {
          setIsProcessing(true);
          setProcessingPhase('transcribing');
          
          // Simulate processing delay for development
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // For now, use mock transcript data
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
            }
          ];
          
          setTranscript(mockTranscript);
          if (options?.onTranscriptionReady) {
            options.onTranscriptionReady(mockTranscript);
          }
          
          setProcessingPhase('analyzing');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          setProcessingPhase('generating');
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Generate mock SOAP note
          const mockSoapNote: SoapNote = {
            subjective: "Patient reports experiencing headaches and dizziness for the past week. Symptoms come and go, with headaches being worse in the morning.",
            objective: "Patient appears alert and oriented. No visible signs of distress. Vital signs within normal limits.",
            assessment: "Suspected tension headaches, possibly related to stress or posture. Differential diagnosis includes migraine, sinusitis.",
            plan: "Recommend over-the-counter pain relievers as needed. Advise on stress reduction techniques and proper ergonomics. Follow up in two weeks if symptoms persist or worsen."
          };
          
          setSoapNote(mockSoapNote);
          if (options?.onSoapNoteReady) {
            options.onSoapNoteReady(mockSoapNote);
          }
          
          setProcessingPhase('complete');
        } catch (error) {
          console.error("Error processing recording:", error);
        } finally {
          setIsProcessing(false);
        }
        
        // Stop all tracks of the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
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
