
import { TranscriptSegment, SoapNote } from "@/types/medical";
import { supabase } from "@/integrations/supabase/client";
import { createFallbackSoapNote } from "./soapNoteParser";

export async function generateWithDeepseekAPI(transcript: TranscriptSegment[]): Promise<SoapNote> {
  try {
    // Fetch API key from Supabase
    const { data: apiData, error: apiError } = await supabase
      .from('apis')
      .select('api_key, endpoint')
      .eq('name', 'deepseek_api')
      .eq('status', 'active')
      .maybeSingle();
    
    if (apiError || !apiData?.api_key) {
      console.error("Error fetching Deepseek API key:", apiError);
      return createFallbackSoapNote(transcript);
    }

    // Format the transcript for the API
    const formattedTranscript = transcript.map(segment => {
      return `${segment.speaker}: ${segment.text}`;
    }).join('\n');

    // Create prompt for the AI
    const prompt = `
You are a dental scribe assistant. Generate a comprehensive SOAP note based on the following dental provider-patient conversation.
Focus on relevant dental information and organize it professionally.

Conversation Transcript:
${formattedTranscript}

Generate a SOAP note with the following format:
S (Subjective): Patient's symptoms, concerns, and history as stated by the patient.
O (Objective): Clinical observations, examination findings, and test results.
A (Assessment): Diagnosis or clinical impression.
P (Plan): Treatment plan, prescriptions, referrals, and follow-up instructions.

Keep each section concise but thorough.
`;

    // Call the Deepseek API
    const response = await fetch(apiData.endpoint || "https://api.deepseek.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiData.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a dental professional creating SOAP notes from transcribed conversations." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1500
      }),
    });

    // Process the API response
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Deepseek API error:", errorData);
      throw new Error(`Deepseek API error: ${response.status}`);
    }

    const result = await response.json();
    const aiResponse = result.choices[0]?.message?.content || "";

    // Parse the AI response into a SOAP note structure
    return parseSoapNoteFromText(aiResponse);
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
