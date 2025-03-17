
import { TranscriptSegment } from "@/types/medical";
import { audioToBase64 } from "@/utils/formatters";
import { toast } from "sonner";
import { callGoogleSpeechApi, transformGoogleResponse } from "./api/googleSpeechClient";
import { simulateTranscriptionProcessing } from "./mocks/mockTranscriptionService";

/**
 * Process audio with Google Speech-to-Text API through Supabase backend
 */
export const processWithGoogleSpeechToText = async (audioBlob: Blob): Promise<TranscriptSegment[]> => {
  try {
    console.log("Processing audio blob:", audioBlob);
    toast.loading("Processing audio...");
    
    // Convert audio to base64 for transmission
    const audioBase64 = await audioToBase64(audioBlob);
    
    try {
      // Call the Google Speech-to-Text API
      const googleResponse = await callGoogleSpeechApi(audioBase64);
      
      toast.dismiss();
      toast.success("Audio processed successfully");
      
      // Transform the Google API response into our transcript format
      return transformGoogleResponse(googleResponse);
      
    } catch (callError) {
      console.error("Error calling Google Speech API:", callError);
      toast.dismiss();
      toast.warning("Using simulated transcription. Add an API key in settings.");
      
      // Fall back to mock data
      return simulateTranscriptionProcessing(audioBlob);
    }
    
  } catch (error) {
    console.error("Error with speech-to-text processing:", error);
    toast.dismiss();
    toast.error("Speech-to-text processing failed");
    
    // Fall back to mock data
    return simulateTranscriptionProcessing(audioBlob);
  }
};
