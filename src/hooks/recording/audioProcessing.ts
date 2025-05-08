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
    // Simple blob validation
    if (!audioBlob || audioBlob.size === 0) {
      console.error("Invalid audio blob: Empty or null");
      toast.error("No audio data to process");
      return simulateTranscriptionProcessing(new Blob([]));
    }
    
    console.log(`Processing audio: ${audioBlob.size} bytes`);
    toast.loading("Processing audio recording...");
    
    try {
      // Convert to base64
      const audioBase64 = await audioToBase64(audioBlob);
      
      try {
        // Call API
        const response = await callLemonFoxApi(audioBase64);
        toast.dismiss();
        toast.success("Processing complete");
        
        return transformLemonFoxResponse(response);
      } catch (error) {
        console.error("API error:", error);
        toast.dismiss();
        toast.error("Transcription error. Using fallback data.");
        return simulateTranscriptionProcessing(audioBlob);
      }
    } catch (error) {
      console.error("Base64 conversion error:", error);
      toast.dismiss();
      toast.error("Audio encoding failed. Using fallback data.");
      return simulateTranscriptionProcessing(audioBlob);
    }
  } catch (error) {
    // Catch-all for any unexpected errors
    console.error("Unexpected error:", error);
    toast.dismiss();
    toast.error("Processing failed. Using fallback data.");
    return simulateTranscriptionProcessing(new Blob([]));
  }
};
