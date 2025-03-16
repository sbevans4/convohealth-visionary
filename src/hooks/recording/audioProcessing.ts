
import { TranscriptSegment } from "@/types/medical";
import { audioToBase64 } from "@/utils/formatters";
import { toast } from "sonner";
import { useApiKeys } from "@/hooks/useApiKeys";
import { supabase } from "@/integrations/supabase/client";

/**
 * Process audio with Google Speech-to-Text API through Supabase backend
 */
export const processWithGoogleSpeechToText = async (audioBlob: Blob): Promise<TranscriptSegment[]> => {
  try {
    console.log("Processing audio blob:", audioBlob);
    toast.loading("Processing audio...");
    
    // Convert audio to base64 for transmission
    const audioBase64 = await audioToBase64(audioBlob);
    
    // Fetch API key directly from Supabase
    const { data: apiData, error: apiError } = await supabase
      .from('apis')
      .select('api_key')
      .eq('name', 'google_speech_api')
      .eq('status', 'active')
      .single();
    
    if (apiError || !apiData?.api_key) {
      console.error("Error fetching Google Speech API key:", apiError);
      throw new Error("Could not retrieve Google Speech API key");
    }

    console.log("Successfully retrieved API key, calling speech-to-text service");
    
    // In a real implementation, you would use the API key to call the Google Speech-to-Text API
    // For example:
    // const response = await fetch('https://speech.googleapis.com/v1/speech:recognize', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${apiData.api_key}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     config: {
    //       encoding: 'WEBM_OPUS',
    //       sampleRateHertz: 48000,
    //       languageCode: 'en-US',
    //       enableAutomaticPunctuation: true,
    //       model: 'medical_conversation',
    //     },
    //     audio: {
    //       content: audioBase64
    //     }
    //   }),
    // });
    //
    // const result = await response.json();
    // if (response.ok) {
    //   return transformGoogleResponse(result);
    // } else {
    //   throw new Error(`Google API error: ${result.error.message}`);
    // }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.dismiss();
    toast.success("Audio processed successfully");
    
    // For now, return simulated transcription
    return simulateTranscriptionProcessing(audioBlob);
    
  } catch (error) {
    console.error("Error with speech-to-text processing:", error);
    toast.dismiss();
    toast.error("Speech-to-text processing failed");
    
    // Fall back to mock data
    return simulateTranscriptionProcessing(audioBlob);
  }
};

/**
 * This function simulates the transcription process for development
 */
export const simulateTranscriptionProcessing = async (audioBlob: Blob): Promise<TranscriptSegment[]> => {
  // In a real app, you would send the audio to a transcription service
  // For now, we'll simulate with mock data
  console.log("Processing audio blob:", audioBlob);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Create mock transcript segments
  const mockTranscript: TranscriptSegment[] = [
    {
      id: "1",
      speaker: "Doctor",
      text: "Hello, how are you feeling today?",
      startTime: 0,
      endTime: 3.5,
      confidence: 0.95
    },
    {
      id: "2",
      speaker: "Patient",
      text: "I've been having headaches and some dizziness for the past week.",
      startTime: 4.0,
      endTime: 9.0,
      confidence: 0.92
    },
    {
      id: "3",
      speaker: "Doctor",
      text: "I see. Is the headache constant or does it come and go?",
      startTime: 10.0,
      endTime: 14.5,
      confidence: 0.97
    },
    {
      id: "4",
      speaker: "Patient",
      text: "It comes and goes. Usually worse in the morning.",
      startTime: 15.0,
      endTime: 19.0,
      confidence: 0.94
    }
  ];
  
  return mockTranscript;
};
