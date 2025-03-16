
import { useState, useRef, useEffect } from "react";
import { TranscriptSegment, SoapNote } from "@/types/medical";
import { toast } from "sonner";
import { isPlatform } from "@/utils/platformUtils";
import { audioToBase64 } from "@/utils/formatters";
import { generateSoapNote } from "@/utils/soapNoteGenerator";

// Define Google API key - in a production app, this should be stored securely
// This is a placeholder - you would need to provide your own API key
const GOOGLE_SPEECH_API_KEY = "YOUR_GOOGLE_API_KEY";

interface UseRecordingOptions {
  onTranscriptionReady?: (transcript: TranscriptSegment[]) => void;
  onSoapNoteReady?: (soapNote: SoapNote) => void;
}

export type ProcessingPhase = 'idle' | 'transcribing' | 'analyzing' | 'generating' | 'complete';

export function useRecording(options?: UseRecordingOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPhase, setProcessingPhase] = useState<ProcessingPhase>('idle');
  const [soapNote, setSoapNote] = useState<SoapNote | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
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
    };
  }, []);

  const startRecording = async () => {
    try {
      resetRecording();
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm' // This format works well with Google Speech-to-Text
      });
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
          setProcessingPhase('transcribing');
          
          // Combine audio chunks into a single blob
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Send to Google Speech API for transcription
          let transcriptResult: TranscriptSegment[] = [];
          
          if (GOOGLE_SPEECH_API_KEY !== "YOUR_GOOGLE_API_KEY") {
            transcriptResult = await processWithGoogleSpeechToText(audioBlob);
          } else {
            // Fall back to mock data if no API key is provided
            transcriptResult = await simulateTranscriptionProcessing(audioBlob);
          }
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
          
          // Save transcript
          setTranscript(transcriptResult);
          
          // Notify through callback if provided
          if (options?.onTranscriptionReady) {
            options.onTranscriptionReady(transcriptResult);
          }
          
          // Continue to SOAP note generation
          setProcessingPhase('analyzing');
          
          // Simulate analysis phase
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          setProcessingPhase('generating');
          
          // Generate SOAP note automatically
          const generatedSoapNote = await generateSoapNote(transcriptResult);
          setSoapNote(generatedSoapNote);
          
          // Notify through callback if provided
          if (options?.onSoapNoteReady) {
            options.onSoapNoteReady(generatedSoapNote);
          }
          
          setProcessingPhase('complete');
          toast.success("SOAP note generated successfully");
          
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

  // Process audio with Google Speech-to-Text API
  const processWithGoogleSpeechToText = async (audioBlob: Blob): Promise<TranscriptSegment[]> => {
    try {
      // Convert audio to base64
      const audioBase64 = await audioToBase64(audioBlob);
      
      // Prepare request to Google Speech-to-Text API
      const response = await fetch(`https://speech.googleapis.com/v1p1beta1/speech:recognize?key=${GOOGLE_SPEECH_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 48000,
            languageCode: 'en-US',
            enableAutomaticPunctuation: true,
            enableSpeakerDiarization: true,
            diarizationSpeakerCount: 2, // Assuming doctor and patient
            model: 'medical_conversation'
          },
          audio: {
            content: audioBase64
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Google Speech API error:", errorData);
        throw new Error(`Google Speech API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Google Speech API response:", data);
      
      // Process the response and convert to our TranscriptSegment format
      // This implementation is simplified and would need to be adjusted based on the actual API response
      const transcriptSegments: TranscriptSegment[] = [];
      
      if (data.results) {
        let startTime = 0;
        
        data.results.forEach((result: any, index: number) => {
          if (result.alternatives && result.alternatives.length > 0) {
            const transcript = result.alternatives[0].transcript;
            const confidence = result.alternatives[0].confidence;
            
            // Calculate approximate timing (this is simplified)
            const wordCount = transcript.split(' ').length;
            const approxDuration = wordCount * 0.5; // Rough estimate of seconds per word
            
            transcriptSegments.push({
              id: `${index + 1}`,
              // Alternate between doctor and patient for simplicity
              // In a real implementation, you'd use the speakerTag from diarization
              speaker: index % 2 === 0 ? "Doctor" : "Patient",
              text: transcript,
              startTime,
              endTime: startTime + approxDuration,
              confidence
            });
            
            startTime += approxDuration;
          }
        });
      }
      
      return transcriptSegments;
      
    } catch (error) {
      console.error("Error with Google Speech-to-Text:", error);
      toast.error("Speech-to-text processing failed");
      
      // Fall back to mock data
      return simulateTranscriptionProcessing(audioBlob);
    }
  };

  // This function simulates the transcription process for development
  const simulateTranscriptionProcessing = async (audioBlob: Blob): Promise<TranscriptSegment[]> => {
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
    
    return mockTranscript;
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
