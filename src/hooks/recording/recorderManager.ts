
import { toast } from "sonner";
import { TranscriptSegment, SoapNote } from "@/types/medical";
import { processWithGoogleSpeechToText, simulateTranscriptionProcessing } from "./audioProcessing";
import { generateSoapNote } from "@/utils/soapNoteGenerator";

// Define Google API key - in a production app, this should be stored securely
const GOOGLE_SPEECH_API_KEY = "YOUR_GOOGLE_API_KEY";

export interface RecorderState {
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
  stream: MediaStream | null;
}

export const createRecorder = async (): Promise<RecorderState | null> => {
  try {
    // Request microphone permission
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Create media recorder
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm' // This format works well with Google Speech-to-Text
    });
    
    return {
      mediaRecorder,
      audioChunks: [],
      stream
    };
  } catch (error) {
    console.error("Error starting recording:", error);
    toast.error("Failed to access microphone");
    return null;
  }
};

export const stopRecorder = (recorderState: RecorderState | null) => {
  if (!recorderState) return;
  
  // Stop all tracks
  if (recorderState.stream) {
    recorderState.stream.getTracks().forEach(track => track.stop());
  }
};

export const processRecording = async (
  audioChunks: Blob[],
  callbacks: {
    onTranscriptReady?: (transcript: TranscriptSegment[]) => void,
    onSoapNoteReady?: (soapNote: SoapNote) => void,
    onPhaseChange?: (phase: 'transcribing' | 'analyzing' | 'generating' | 'complete') => void
  }
): Promise<{ transcript: TranscriptSegment[], soapNote: SoapNote }> => {
  try {
    callbacks.onPhaseChange?.('transcribing');
    
    // Combine audio chunks into a single blob
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    
    // Send to Google Speech API for transcription
    let transcriptResult: TranscriptSegment[] = [];
    
    if (GOOGLE_SPEECH_API_KEY !== "YOUR_GOOGLE_API_KEY") {
      transcriptResult = await processWithGoogleSpeechToText(audioBlob);
    } else {
      // Fall back to mock data if no API key is provided
      transcriptResult = await simulateTranscriptionProcessing(audioBlob);
    }
    
    // Notify through callback if provided
    if (callbacks.onTranscriptReady) {
      callbacks.onTranscriptReady(transcriptResult);
    }
    
    // Continue to SOAP note generation
    callbacks.onPhaseChange?.('analyzing');
    
    // Simulate analysis phase
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    callbacks.onPhaseChange?.('generating');
    
    // Generate SOAP note automatically
    const generatedSoapNote = await generateSoapNote(transcriptResult);
    
    // Notify through callback if provided
    if (callbacks.onSoapNoteReady) {
      callbacks.onSoapNoteReady(generatedSoapNote);
    }
    
    callbacks.onPhaseChange?.('complete');
    toast.success("SOAP note generated successfully");
    
    return {
      transcript: transcriptResult,
      soapNote: generatedSoapNote
    };
  } catch (error) {
    console.error("Error processing recording:", error);
    toast.error("Failed to process recording");
    throw error;
  }
};
