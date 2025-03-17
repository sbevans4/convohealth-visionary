
import { TranscriptSegment } from "@/types/medical";
import { audioToBase64 } from "@/utils/formatters";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch LemonFox API configuration from Supabase
 */
export const getLemonFoxApiConfig = async (): Promise<{ api_key: string; endpoint: string } | null> => {
  const { data, error } = await supabase
    .from('apis')
    .select('api_key, endpoint')
    .eq('name', 'lemonfox_api')
    .eq('status', 'active')
    .maybeSingle();
  
  if (error || !data?.api_key) {
    console.error("Error fetching LemonFox API key:", error);
    return null;
  }
  
  return {
    api_key: data.api_key,
    endpoint: data.endpoint || "https://api.lemonfox.ai/v1/transcribe"
  };
};

/**
 * Call the LemonFox API with audio data
 */
export const callLemonFoxApi = async (audioBase64: string): Promise<any> => {
  const apiConfig = await getLemonFoxApiConfig();
  
  if (!apiConfig) {
    throw new Error("Failed to get LemonFox API configuration");
  }
  
  const response = await fetch(apiConfig.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiConfig.api_key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audio: {
        content: audioBase64
      },
      config: {
        language_code: 'en-US',
        enable_automatic_punctuation: true,
        audio_encoding: 'WEBM_OPUS',
        sample_rate_hertz: 48000,
        enable_speaker_diarization: true,
        diarization_speaker_count: 2,
        model: 'medical'
      }
    }),
  });
  
  if (!response.ok) {
    const result = await response.json();
    throw new Error(`LemonFox API error: ${result.error?.message || "Unknown error"}`);
  }
  
  return response.json();
};

/**
 * Transform LemonFox API response to our transcript format
 */
export const transformLemonFoxResponse = (response: any): TranscriptSegment[] => {
  if (!response?.results || !response.results.length) {
    return [];
  }
  
  const transcript: TranscriptSegment[] = [];
  let idCounter = 1;
  let currentTime = 0;
  
  // Process the transcript data from LemonFox
  response.results.forEach((result: any) => {
    if (result.alternatives && result.alternatives.length > 0) {
      const alternative = result.alternatives[0];
      
      // Process speaker segments
      if (alternative.words && alternative.words.length > 0) {
        let currentSpeaker = "";
        let currentText = "";
        let segmentStartTime = 0;
        
        alternative.words.forEach((word: any, index: number) => {
          // If this is a new speaker or first word
          if (word.speaker !== currentSpeaker || index === 0) {
            // Save the previous segment if it exists
            if (currentText.length > 0) {
              transcript.push({
                id: idCounter.toString(),
                speaker: currentSpeaker === "1" ? "Doctor" : "Patient",
                text: currentText.trim(),
                startTime: segmentStartTime,
                endTime: parseFloat(word.startTime.replace('s', '')),
                confidence: 0.9 // Default confidence
              });
              idCounter++;
            }
            
            // Start a new segment
            currentSpeaker = word.speaker;
            currentText = word.word + " ";
            segmentStartTime = parseFloat(word.startTime.replace('s', ''));
          } else {
            // Continue the current segment
            currentText += word.word + " ";
          }
          
          // If this is the last word, save the segment
          if (index === alternative.words.length - 1) {
            transcript.push({
              id: idCounter.toString(),
              speaker: currentSpeaker === "1" ? "Doctor" : "Patient",
              text: currentText.trim(),
              startTime: segmentStartTime,
              endTime: parseFloat(word.endTime.replace('s', '')),
              confidence: 0.9 // Default confidence
            });
            idCounter++;
          }
        });
      } else {
        // Fallback if word-level data is not available
        const text = alternative.transcript || '';
        const speaker = idCounter % 2 === 0 ? 'Patient' : 'Doctor';
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
    }
  });
  
  return transcript;
};
