
import { TranscriptSegment } from "@/types/medical";
import { audioToBase64 } from "@/utils/formatters";
import { toast } from "sonner";
import { callLemonFoxApi, transformLemonFoxResponse } from "./api/lemonFoxClient";
import { simulateTranscriptionProcessing } from "./mocks/mockTranscriptionService";

/**
 * Process audio with LemonFox API through Supabase backend
 */
export const processWithLemonFoxAPI = async (audioBlob: Blob): Promise<TranscriptSegment[]> => {
  try {
    console.log("Processing audio blob:", audioBlob);
    toast.loading("Processing audio with LemonFox API...");
    
    // Convert audio to base64 for transmission
    const audioBase64 = await audioToBase64(audioBlob);
    
    try {
      // Call the LemonFox API
      const response = await callLemonFoxApi(audioBase64);
      
      toast.dismiss();
      toast.success("Audio processed successfully with LemonFox API");
      
      // Transform the LemonFox API response into our transcript format
      return transformLemonFoxResponse(response);
      
    } catch (callError) {
      console.error("Error calling LemonFox API:", callError);
      toast.dismiss();
      toast.error("LemonFox API error. Using simulated transcription instead.");
      
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
