
import { TranscriptSegment } from "@/types/medical";
import { audioToBase64 } from "@/utils/formatters";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch Google Speech API configuration from Supabase
 */
export const getGoogleSpeechApiConfig = async (): Promise<{ api_key: string; endpoint: string } | null> => {
  const { data, error } = await supabase
    .from('apis')
    .select('api_key, endpoint')
    .eq('name', 'google_speech_api')
    .eq('status', 'active')
    .maybeSingle();
  
  if (error || !data?.api_key) {
    console.error("Error fetching Google Speech API key:", error);
    return null;
  }
  
  return {
    api_key: data.api_key,
    endpoint: data.endpoint || "https://speech.googleapis.com/v1/speech:recognize"
  };
};

/**
 * Call the Google Speech-to-Text API with audio data
 */
export const callGoogleSpeechApi = async (audioBase64: string): Promise<any> => {
  const apiConfig = await getGoogleSpeechApiConfig();
  
  if (!apiConfig) {
    throw new Error("Failed to get Google Speech API configuration");
  }
  
  const response = await fetch(apiConfig.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiConfig.api_key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
        model: 'medical_conversation',
      },
      audio: {
        content: audioBase64
      }
    }),
  });
  
  if (!response.ok) {
    const result = await response.json();
    throw new Error(`Google API error: ${result.error?.message || "Unknown error"}`);
  }
  
  return response.json();
};

/**
 * Transform Google Speech-to-Text API response to our transcript format
 */
export const transformGoogleResponse = (googleResponse: any): TranscriptSegment[] => {
  if (!googleResponse?.results) {
    return [];
  }
  
  const transcript: TranscriptSegment[] = [];
  let idCounter = 1;
  let currentTime = 0;
  
  googleResponse.results.forEach((result: any) => {
    if (result.alternatives && result.alternatives.length > 0) {
      const alternative = result.alternatives[0];
      const text = alternative.transcript || '';
      
      // Simple speaker diarization - alternate between Doctor and Patient
      // In a real implementation, you'd use Google's speaker diarization
      const speaker = idCounter % 2 === 0 ? 'Patient' : 'Doctor';
      
      // Estimate timing - in a real app, use the word timings from Google
      const duration = text.split(' ').length * 0.5; // rough estimate: 0.5 seconds per word
      
      transcript.push({
        id: idCounter.toString(),
        speaker,
        text,
        startTime: currentTime,
        endTime: currentTime + duration,
        confidence: alternative.confidence || 0.9
      });
      
      currentTime += duration + 0.5; // Add a small gap between segments
      idCounter++;
    }
  });
  
  return transcript;
};
