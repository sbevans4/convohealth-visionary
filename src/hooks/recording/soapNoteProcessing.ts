
import { TranscriptSegment, SoapNote } from "@/types/medical";
import { supabase } from "@/integrations/supabase/client";
import { createFallbackSoapNote } from "./soapNoteParser";
import { callDeepseekApi } from "./deepseekApiClient";

export async function generateWithDeepseekAPI(transcript: TranscriptSegment[]): Promise<SoapNote> {
  try {
    // Format the transcript for the API
    const formattedTranscript = transcript.map(segment => {
      return `${segment.speaker}: ${segment.text}`;
    }).join('\n');

    // Call the Deepseek API
    const soapNoteText = await callDeepseekApi(formattedTranscript);
    
    // Parse the AI response into a SOAP note structure
    return parseSoapNoteFromText(soapNoteText);
  } catch (error) {
    console.error("Error generating SOAP note with Deepseek:", error);
    return createFallbackSoapNote(transcript);
  }
}

// Parse the AI-generated text into a structured SOAP note
function parseSoapNoteFromText(text: string): SoapNote {
  // Default empty SOAP note
  const soapNote: SoapNote = {
    subjective: "",
    objective: "",
    assessment: "",
    plan: ""
  };

  // Look for section headers in the text
  const subjectiveMatch = text.match(/S(?:ubjective)?:\s*([\s\S]*?)(?=O(?:bjective)?:|A(?:ssessment)?:|P(?:lan)?:|$)/i);
  const objectiveMatch = text.match(/O(?:bjective)?:\s*([\s\S]*?)(?=A(?:ssessment)?:|P(?:lan)?:|$)/i);
  const assessmentMatch = text.match(/A(?:ssessment)?:\s*([\s\S]*?)(?=P(?:lan)?:|$)/i);
  const planMatch = text.match(/P(?:lan)?:\s*([\s\S]*?)(?=$)/i);

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

  return soapNote;
}
