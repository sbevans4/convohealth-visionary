import { toast } from "sonner";
import { TranscriptSegment, SoapNote } from "@/types/medical";
import { processWithGoogleSpeechToText, simulateTranscriptionProcessing } from "./audioProcessing";
import { generateSoapNote } from "@/utils/soapNoteGenerator";

export interface RecorderState {
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
  stream: MediaStream | null;
}

export const createRecorder = async (): Promise<RecorderState | null> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm'
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
    
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    
    let transcriptResult: TranscriptSegment[] = [];
    
    transcriptResult = await processWithGoogleSpeechToText(audioBlob);
    
    if (callbacks.onTranscriptReady) {
      callbacks.onTranscriptReady(transcriptResult);
    }
    
    callbacks.onPhaseChange?.('analyzing');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    callbacks.onPhaseChange?.('generating');
    
    const generatedSoapNote = await generateSoapNote(transcriptResult);
    
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
