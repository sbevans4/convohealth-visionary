import { TranscriptSegment, SoapNote } from "@/types/medical";
import { processWithGoogleSpeechToText } from "./audioProcessing";
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
    const transcript = await processWithGoogleSpeechToText(audioBlob);
    
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

export async function setupDeepseekApiKey() {
  try {
    const deepseekApiKey = "sk-203ab682367d4f75a2b568443a33c87b";
    
    // Check if the key already exists
    const { data, error } = await supabase
      .from('apis')
      .select('id')
      .eq('name', 'deepseek_api')
      .single();
    
    if (error) {
      // Key doesn't exist, insert it
      const { error: insertError } = await supabase
        .from('apis')
        .insert({
          name: 'deepseek_api',
          api_key: deepseekApiKey,
          status: 'active',
          endpoint: 'https://api.deepseek.com/v1/chat/completions'
        });
      
      if (insertError) {
        console.error("Error inserting Deepseek API key:", insertError);
      } else {
        console.log("Deepseek API key added to database");
      }
    } else {
      // Key exists, update it
      const { error: updateError } = await supabase
        .from('apis')
        .update({ 
          api_key: deepseekApiKey,
          status: 'active',
          endpoint: 'https://api.deepseek.com/v1/chat/completions'
        })
        .eq('id', data.id);
      
      if (updateError) {
        console.error("Error updating Deepseek API key:", updateError);
      } else {
        console.log("Deepseek API key updated in database");
      }
    }
  } catch (err) {
    console.error("Error setting up Deepseek API key:", err);
  }
}

// Initialize the API key on module load
setupDeepseekApiKey().catch(console.error);
