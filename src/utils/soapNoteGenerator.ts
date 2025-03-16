
import { TranscriptSegment, SoapNote } from "@/types/medical";
import { generateWithDeepseekAPI } from "@/hooks/recording/soapNoteProcessing";
import { isPlatform, isOnline } from "@/utils/platformUtils";

export async function generateSoapNote(transcript: TranscriptSegment[]): Promise<SoapNote> {
  console.log("Generating SOAP note from transcript:", transcript);
  
  try {
    // First check if we're online
    const online = await isOnline();
    if (!online) {
      console.log("Device is offline, using fallback SOAP note generation");
      return generateFallbackSoapNote(transcript);
    }
    
    // Then check platform-specific handling
    if (isPlatform('android') || isPlatform('ios')) {
      try {
        // Use the Deepseek API to generate a SOAP note
        return await generateWithDeepseekAPI(transcript);
      } catch (error) {
        console.error("Error using Deepseek API in native environment:", error);
        // On native platforms, show a simpler fallback due to mobile constraints
        return generateFallbackSoapNote(transcript);
      }
    } else {
      // For web, try the full API experience
      return await generateWithDeepseekAPI(transcript);
    }
  } catch (error) {
    console.error("Error generating SOAP note, falling back to mock data:", error);
    return generateFallbackSoapNote(transcript);
  }
}

function generateFallbackSoapNote(transcript: TranscriptSegment[]): SoapNote {
  // Extract any useful information from the transcript
  const medicalInfo = extractMedicalInfo(transcript);
  
  // Build a simple SOAP note from extracted info
  const subjective = buildSubjectiveFromExtractedInfo(medicalInfo);
  
  return {
    subjective: subjective || "Patient reports experiencing symptoms. Details limited due to connection issues.",
    objective: "Unable to fully process objective findings. Please review the transcript for details.",
    assessment: "Assessment generation limited. Please review transcript for clinical decision making.",
    plan: "Consider reviewing the full transcript and regenerating the note when online."
  };
}

function buildSubjectiveFromExtractedInfo(medicalInfo: Record<string, string[]>): string {
  const parts: string[] = [];
  
  // Add pain information
  if (medicalInfo.pain && medicalInfo.pain.length > 0) {
    parts.push(`Patient reports pain. ${medicalInfo.pain[0]}`);
  }
  
  // Add headache information
  if (medicalInfo.headache && medicalInfo.headache.length > 0) {
    parts.push(`Patient reports headache. ${medicalInfo.headache[0]}`);
  }
  
  // Add remaining relevant information
  for (const [keyword, sentences] of Object.entries(medicalInfo)) {
    if (keyword !== 'pain' && keyword !== 'headache' && sentences.length > 0) {
      parts.push(`Patient mentions ${keyword}: ${sentences[0]}`);
    }
  }
  
  return parts.join(' ');
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
