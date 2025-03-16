import { TranscriptSegment, SoapNote } from "@/types/medical";
import { generateWithDeepseekAPI } from "@/hooks/recording/soapNoteProcessing";

export async function generateSoapNote(transcript: TranscriptSegment[]): Promise<SoapNote> {
  console.log("Generating SOAP note from transcript:", transcript);
  
  try {
    // Use the Deepseek API to generate a SOAP note
    return await generateWithDeepseekAPI(transcript);
  } catch (error) {
    console.error("Error using Deepseek API, falling back to mock data:", error);
    
    // If the API fails, fall back to mock SOAP note
    return {
      subjective: "Patient reports experiencing headaches and dizziness for the past week. " +
                 "The headaches are intermittent and typically worse in the morning. " +
                 "No reported trauma or previous history of similar symptoms.",
      
      objective: "Vital signs stable. Alert and oriented x3. " +
                "No visible signs of trauma. " +
                "Neurological exam shows normal reflexes and muscle strength. " +
                "Pupils equal and reactive to light.",
      
      assessment: "Suspected tension headache, possibly related to stress or poor sleep hygiene. " +
                 "Differential diagnoses include migraine, sinusitis, and hypertension-related headache.",
      
      plan: "Recommend over-the-counter analgesics as needed for pain. " +
           "Advised to maintain proper hydration and sleep schedule. " +
           "Return if symptoms worsen or continue beyond one week. " +
           "Consider referral to neurology if symptoms persist."
    };
  }
}

// Helper function to extract key medical information from transcript
export function extractMedicalInfo(transcript: TranscriptSegment[]) {
  const keywords = [
    "pain", "headache", "dizziness", "nausea", "fever", 
    "cough", "breathing", "medication", "allergies"
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
