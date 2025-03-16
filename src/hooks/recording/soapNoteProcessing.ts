
import { TranscriptSegment, SoapNote } from "@/types/medical";
import { toast } from "sonner";
import { callDeepseekApi } from "./deepseekApiClient";
import { parseSoapNoteFromText, createFallbackSoapNote } from "./soapNoteParser";

/**
 * Generate a SOAP note using the Deepseek API
 */
export const generateWithDeepseekAPI = async (transcript: TranscriptSegment[]): Promise<SoapNote> => {
  try {
    console.log("Generating SOAP note from transcript using Deepseek API");
    toast.loading("Generating SOAP note...");
    
    // Format transcript for the API
    const transcriptText = transcript
      .map(segment => `${segment.speaker}: ${segment.text}`)
      .join('\n');
    
    try {
      // Call the Deepseek API
      const soapNoteText = await callDeepseekApi(transcriptText);
      
      // Parse the SOAP note from the response
      const parsedSoapNote = parseSoapNoteFromText(soapNoteText);
      
      toast.dismiss();
      toast.success("SOAP note generated successfully");
      
      return parsedSoapNote;
    } catch (callError) {
      console.error("Error calling Deepseek API:", callError);
      toast.dismiss();
      toast.warning("Using simulated SOAP note. Check API key settings.");
      return createFallbackSoapNote(transcript);
    }
    
  } catch (error) {
    console.error("Error generating SOAP note:", error);
    toast.dismiss();
    toast.error("Failed to generate SOAP note");
    
    // Fall back to simple SOAP note
    return createFallbackSoapNote(transcript);
  }
};
