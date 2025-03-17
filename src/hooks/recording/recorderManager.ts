
import { TranscriptSegment, SoapNote } from "@/types/medical";
import { processWithLemonFoxAPI } from "./audioProcessing";
import { generateSoapNote } from "@/utils/soapNoteGenerator";
import { supabase } from "@/integrations/supabase/client";

export interface RecorderState {
  mediaRecorder: MediaRecorder;
  stream: MediaStream;
}

export interface ProcessingCallbacks {
  onTranscriptReady?: (transcript: TranscriptSegment[]) => void;
  onSoapNoteReady?: (soapNote: SoapNote) => void;
  onPhaseChange?: (phase: string) => void;
}

export const createRecorder = async (): Promise<RecorderState | null> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
    
    return { mediaRecorder, stream };
  } catch (error) {
    console.error("Error creating media recorder:", error);
    return null;
  }
};

export const stopRecorder = (recorderState: RecorderState) => {
  recorderState.mediaRecorder.stream.getTracks().forEach(track => track.stop());
};

export const processRecording = async (
  audioChunks: Blob[],
  callbacks?: ProcessingCallbacks
): Promise<{ transcript: TranscriptSegment[]; soapNote: SoapNote | null }> => {
  try {
    // Initial setup
    if (!audioChunks || audioChunks.length === 0) {
      throw new Error("No audio data available to process.");
    }

    // Phase 1: Transcribe audio
    if (callbacks?.onPhaseChange) {
      callbacks.onPhaseChange('transcribing');
    }
    
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
    const transcript = await processWithLemonFoxAPI(audioBlob);
    
    if (callbacks?.onTranscriptReady) {
      callbacks.onTranscriptReady(transcript);
    }
    
    // Phase 2: Analyze transcript
    if (callbacks?.onPhaseChange) {
      callbacks.onPhaseChange('analyzing');
    }
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause for visual feedback
    
    // Phase 3: Generate SOAP note
    if (callbacks?.onPhaseChange) {
      callbacks.onPhaseChange('generating');
    }
    
    const soapNote = await generateSoapNote(transcript);
    
    if (callbacks?.onSoapNoteReady) {
      callbacks.onSoapNoteReady(soapNote);
    }
    
    if (callbacks?.onPhaseChange) {
      callbacks.onPhaseChange('complete');
    }
    
    return { transcript, soapNote };
  } catch (error) {
    console.error("Error processing recording:", error);
    throw error;
  }
};

// Function to check and setup API keys on initialization
export async function setupApiKeys() {
  try {
    // Check if we need to setup the LemonFox API key
    const { data: lemonFoxData, error: lemonFoxError } = await supabase
      .from('apis')
      .select('id')
      .eq('name', 'lemonfox_api')
      .single();
    
    if (lemonFoxError) {
      console.log("Need to set up LemonFox API key");
    } else {
      console.log("LemonFox API key already configured");
    }
    
    // Check and setup the Deepseek API key
    const { data: deepseekData, error: deepseekError } = await supabase
      .from('apis')
      .select('id')
      .eq('name', 'deepseek_api')
      .single();
    
    if (deepseekError) {
      console.log("Setting up initial Deepseek API key");
      const { error: insertError } = await supabase
        .from('apis')
        .insert({
          name: 'deepseek_api',
          api_key: "sk-203ab682367d4f75a2b568443a33c87b",
          status: 'active',
          endpoint: 'https://api.deepseek.com/v1/chat/completions'
        });
      
      if (insertError) {
        console.error("Error inserting Deepseek API key:", insertError);
      } else {
        console.log("Deepseek API key added to database");
      }
    } else {
      console.log("Deepseek API key already configured");
    }
  } catch (err) {
    console.error("Error setting up API keys:", err);
  }
}

// Initialize API keys on module load
setupApiKeys().catch(console.error);
