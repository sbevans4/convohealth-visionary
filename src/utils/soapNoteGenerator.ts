
import { TranscriptSegment, SoapNote } from "@/types/medical";
import { generateWithDeepseekAPI } from "@/hooks/recording/soapNoteProcessing";
import { createFallbackSoapNote } from "@/hooks/recording/soapNoteParser";
import { isPlatform, isOnline } from "@/utils/platformUtils";

export async function generateSoapNote(transcript: TranscriptSegment[]): Promise<SoapNote> {
  console.log("Generating SOAP note from transcript:", transcript);
  
  try {
    // First check if we're online
    const online = await isOnline();
    if (!online) {
      console.log("Device is offline, using fallback SOAP note generation");
      return createFallbackSoapNote(transcript);
    }
    
    // Then check platform-specific handling
    if (isPlatform('android') || isPlatform('ios')) {
      try {
        // Use the Deepseek API to generate a SOAP note
        return await generateWithDeepseekAPI(transcript);
      } catch (error) {
        console.error("Error using Deepseek API in native environment:", error);
        // On native platforms, show a simpler fallback due to mobile constraints
        return createFallbackSoapNote(transcript);
      }
    } else {
      // For web, try the full API experience
      return await generateWithDeepseekAPI(transcript);
    }
  } catch (error) {
    console.error("Error generating SOAP note, falling back to mock data:", error);
    return createFallbackSoapNote(transcript);
  }
}

// Helper function to extract key medical information from transcript
export function extractMedicalInfo(transcript: TranscriptSegment[]) {
  const keywords = [
    "pain", "headache", "dizziness", "nausea", "fever", 
    "cough", "breathing", "medication", "allergies",
    "hypertension", "diabetes", "asthma", "heart", "medication"
  ];
  
  const findings: Record<string, string[]> = {};
  
  transcript.forEach(segment => {
    keywords.forEach(keyword => {
      if (segment.text.toLowerCase().includes(keyword)) {
        if (!findings[keyword]) {
          findings[keyword] = [];
        }
        findings[keyword].push(segment.text);
      }
    });
  });
  
  return findings;
}
