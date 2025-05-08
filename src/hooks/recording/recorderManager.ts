import { TranscriptSegment, SoapNote } from "@/types/medical";
import { processWithLemonFoxAPI } from "./audioProcessing";
import { generateSoapNote } from "@/utils/soapNoteGenerator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { initializeLemonFoxApi } from './api/lemonFoxClient';

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
    console.log("Requesting audio permission...");
    
    // Try to get the best audio quality
    const audioConstraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    };
    
    const stream = await navigator.mediaDevices.getUserMedia(audioConstraints);
    console.log("Audio permission granted");
    
    // Check which MIME types are supported
    const mimeTypes = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4'
    ];
    
    let selectedMimeType = '';
    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        selectedMimeType = mimeType;
        console.log(`Using supported MIME type: ${selectedMimeType}`);
        break;
      }
    }
    
    // Create the MediaRecorder
    const mediaRecorder = new MediaRecorder(stream, { 
      mimeType: selectedMimeType || undefined
    });
    
    console.log("MediaRecorder created successfully");
    
    return { mediaRecorder, stream };
  } catch (error) {
    console.error("Error creating media recorder:", error);
    toast.error("Could not access microphone. Please check permissions.");
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
    
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
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
export const setupApiKeys = async () => {
  try {
    // First initialize the LemonFox API configuration
    await initializeLemonFoxApi();
    
    // Then continue with the rest of the API setup
    // Check if we need to setup the LemonFox API key
    const { data: lemonFoxData, error: lemonFoxError } = await supabase
      .from('apis')
      .select('id, endpoint')
      .eq('name', 'lemonfox_api')
      .single();
    
    if (lemonFoxError) {
      console.log("Setting up initial LemonFox API key");
      const { error: insertError } = await supabase
        .from('apis')
        .insert({
          name: 'lemonfox_api',
          api_key: "JWOW9fkQkG5QxIdAqwRTcpRb3otp1OhE",
          status: 'active',
          endpoint: 'https://api.lemonfox.ai/v1/audio/transcriptions'
        });
      
      if (insertError) {
        console.error("Error inserting LemonFox API key:", insertError);
      } else {
        console.log("LemonFox API key added to database");
      }
    } else {
      console.log("LemonFox API key already configured");
      
      // Check if the endpoint needs to be updated
      if (lemonFoxData.endpoint === 'https://api.lemonfox.ai/v1/transcribe') {
        console.log("Updating LemonFox API endpoint to correct URL");
        const { error: updateError } = await supabase
          .from('apis')
          .update({
            endpoint: 'https://api.lemonfox.ai/v1/audio/transcriptions'
          })
          .eq('id', lemonFoxData.id);
        
        if (updateError) {
          console.error("Error updating LemonFox API endpoint:", updateError);
        } else {
          console.log("LemonFox API endpoint updated successfully");
        }
      }
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
};

// Don't auto-initialize, let the app explicitly call this
// setupApiKeys().catch(console.error);
