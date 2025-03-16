
import { TranscriptSegment, SoapNote } from "@/types/medical";

export async function generateSoapNote(transcript: TranscriptSegment[]): Promise<SoapNote> {
  // In a production app, this would call an AI service to generate the SOAP note
  // For now, we'll simulate the process with mock data
  
  console.log("Generating SOAP note from transcript:", transcript);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simple mock SOAP note based on the transcript content
  const fullText = transcript.map(segment => segment.text).join(" ");
  
  // Mock SOAP note generation
  const soapNote: SoapNote = {
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
  
  return soapNote;
}

// Helper function to extract key medical information from transcript
export function extractMedicalInfo(transcript: TranscriptSegment[]) {
  // This would be more sophisticated in a real app, potentially using NLP
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
