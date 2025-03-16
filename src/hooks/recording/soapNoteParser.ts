
import { SoapNote } from "@/types/medical";

/**
 * Extract SOAP note sections from the API response text
 */
export function parseSoapNoteFromText(text: string): SoapNote {
  // Initialize default sections
  const soapNote: SoapNote = {
    subjective: "",
    objective: "",
    assessment: "",
    plan: ""
  };
  
  // Find each section using regex
  const subjectiveMatch = text.match(/SUBJECTIVE:?([\s\S]*?)(?=OBJECTIVE:|ASSESSMENT:|PLAN:|$)/i);
  const objectiveMatch = text.match(/OBJECTIVE:?([\s\S]*?)(?=SUBJECTIVE:|ASSESSMENT:|PLAN:|$)/i);
  const assessmentMatch = text.match(/ASSESSMENT:?([\s\S]*?)(?=SUBJECTIVE:|OBJECTIVE:|PLAN:|$)/i);
  const planMatch = text.match(/PLAN:?([\s\S]*?)(?=SUBJECTIVE:|OBJECTIVE:|ASSESSMENT:|$)/i);
  
  // Extract content for each section
  if (subjectiveMatch && subjectiveMatch[1]) {
    soapNote.subjective = subjectiveMatch[1].trim();
  }
  
  if (objectiveMatch && objectiveMatch[1]) {
    soapNote.objective = objectiveMatch[1].trim();
  }
  
  if (assessmentMatch && assessmentMatch[1]) {
    soapNote.assessment = assessmentMatch[1].trim();
  }
  
  if (planMatch && planMatch[1]) {
    soapNote.plan = planMatch[1].trim();
  }
  
  // If any section is empty, provide a default message
  if (!soapNote.subjective) {
    soapNote.subjective = "No subjective information provided in the conversation.";
  }
  
  if (!soapNote.objective) {
    soapNote.objective = "No objective findings mentioned in the transcript.";
  }
  
  if (!soapNote.assessment) {
    soapNote.assessment = "Assessment could not be determined based on the provided transcript.";
  }
  
  if (!soapNote.plan) {
    soapNote.plan = "No treatment plan was specified in the conversation.";
  }
  
  return soapNote;
}

/**
 * Create a fallback SOAP note if API fails
 */
export function createFallbackSoapNote(transcript: any[]): SoapNote {
  console.log("Using fallback SOAP note generation");
  
  // Extract statements from patient and doctor
  const patientStatements = transcript
    .filter(segment => segment.speaker === "Patient")
    .map(segment => segment.text);
  
  const doctorStatements = transcript
    .filter(segment => segment.speaker === "Doctor")
    .map(segment => segment.text);
  
  // Extract key symptoms and complaints
  const commonSymptoms = [
    "pain", "headache", "dizziness", "nausea", "fever", 
    "cough", "fatigue", "weakness", "numbness", "tingling"
  ];
  
  const foundSymptoms = commonSymptoms.filter(symptom => 
    patientStatements.some(statement => 
      statement.toLowerCase().includes(symptom)
    )
  );
  
  // Generate a basic subjective section
  const subjective = patientStatements.length > 0 
    ? `Patient reports: ${patientStatements.join(" ")}` 
    : "No patient statements recorded.";
  
  // Generate a basic assessment based on symptoms
  let assessment = "Based on the limited information provided, ";
  if (foundSymptoms.length > 0) {
    assessment += `the patient is presenting with ${foundSymptoms.join(", ")}. `;
    
    if (foundSymptoms.includes("headache") && foundSymptoms.includes("dizziness")) {
      assessment += "This could suggest tension headache, migraine, or other neurological conditions. ";
    } else if (foundSymptoms.includes("fever") && (foundSymptoms.includes("cough") || foundSymptoms.includes("pain"))) {
      assessment += "This could suggest an infectious process. ";
    }
  } else {
    assessment += "no clear diagnostic pattern is evident. ";
  }
  assessment += "Further examination would be required for a definitive diagnosis.";
  
  // Generate a basic plan based on doctor's statements
  const plan = doctorStatements.length > 0 
    ? `Provider recommendations: ${doctorStatements.join(" ")}` 
    : "No treatment plan specified in the conversation.";
  
  return {
    subjective,
    objective: "Physical examination data not available from transcript.",
    assessment,
    plan
  };
}
