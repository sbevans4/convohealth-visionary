
import { SoapNote } from "@/types/medical";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeepseekApiResponse {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
  error?: {
    message?: string;
  };
}

/**
 * Get the Deepseek API key and endpoint from Supabase
 */
export const getDeepseekApiConfig = async (): Promise<{ api_key: string; endpoint: string } | null> => {
  const { data, error } = await supabase
    .from('apis')
    .select('api_key, endpoint')
    .eq('name', 'deepseek_api')
    .eq('status', 'active')
    .maybeSingle();
  
  if (error || !data?.api_key) {
    console.error("Error fetching Deepseek API key:", error);
    return null;
  }
  
  return {
    api_key: data.api_key,
    endpoint: data.endpoint || "https://api.deepseek.com/v1/chat/completions"
  };
};

/**
 * Call the Deepseek API to generate a SOAP note
 */
export const callDeepseekApi = async (transcriptText: string): Promise<string> => {
  const apiConfig = await getDeepseekApiConfig();
  
  if (!apiConfig) {
    throw new Error("Failed to get Deepseek API configuration");
  }
  
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
  
  const response = await fetch(apiConfig.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiConfig.api_key}`,
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
  
  const result: DeepseekApiResponse = await response.json();
  
  if (!response.ok) {
    throw new Error(`Deepseek API error: ${result.error?.message || "Unknown error"}`);
  }
  
  const soapNoteText = result.choices?.[0]?.message?.content || "";
  if (!soapNoteText) {
    throw new Error("Empty response from Deepseek API");
  }
  
  return soapNoteText;
};
