
import { TranscriptSegment, SoapNote } from "@/types/medical";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
    
    // Fetch API key from Supabase
    const { data: apiData, error: apiError } = await supabase
      .from('apis')
      .select('api_key, endpoint')
      .eq('name', 'deepseek_api')
      .eq('status', 'active')
      .maybeSingle();
    
    if (apiError || !apiData?.api_key) {
      console.error("Error fetching Deepseek API key:", apiError);
      console.log("Falling back to basic SOAP note generation");
      toast.dismiss();
      toast.warning("Using simulated SOAP note. Check API key settings.");
      return fallbackSoapNote(transcript);
    }

    console.log("Successfully retrieved API key, calling Deepseek API");
    
    try {
      // Define the prompt for generating a SOAP note
      const prompt = `
You are a medical scribe assistant. Your task is to create a comprehensive SOAP note based on the following medical conversation transcript.

TRANSCRIPT:
${transcriptText}

Please structure your response as a formal SOAP note with the following sections:

SUBJECTIVE: Patient's history, symptoms, complaints, and relevant information as described by the patient.
OBJECTIVE: Observable findings, vital signs, examination results, and other measurable data.
ASSESSMENT: Your clinical impression, diagnosis, differential diagnoses, and reasoning.
PLAN: Treatment recommendations, medications, tests, referrals, patient education, and follow-up instructions.

Ensure the note is professional, concise, and medically accurate. Include all relevant information from the transcript, while maintaining patient confidentiality.
      `;
      
      // Call the Deepseek API
      const apiUrl = apiData.endpoint || "https://api.deepseek.com/v1/chat/completions";
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiData.api_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "You are an expert medical scribe AI that creates professional SOAP notes based on medical conversations. The notes should be structured, professional, and contain all relevant medical information."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        }),
      });
      
      const result = await response.json();
      if (!response.ok) {
        console.error("Deepseek API error:", result.error || "Unknown error");
        throw new Error(`Deepseek API error: ${result.error?.message || "Unknown error"}`);
      }
      
      // Process the API response
      const soapNoteText = result.choices?.[0]?.message?.content || "";
      if (!soapNoteText) {
        throw new Error("Empty response from Deepseek API");
      }
      
      // Parse the SOAP note from the response
      const parsedSoapNote = parseSoapNoteFromText(soapNoteText);
      
      toast.dismiss();
      toast.success("SOAP note generated successfully");
      
      return parsedSoapNote;
    } catch (callError) {
      console.error("Error calling Deepseek API:", callError);
      throw callError;
    }
    
  } catch (error) {
    console.error("Error generating SOAP note:", error);
    toast.dismiss();
    toast.error("Failed to generate SOAP note");
    
    // Fall back to simple SOAP note
    return fallbackSoapNote(transcript);
  }
};

/**
 * Extract SOAP note sections from the API response text
 */
function parseSoapNoteFromText(text: string): SoapNote {
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
function fallbackSoapNote(transcript: TranscriptSegment[]): SoapNote {
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
