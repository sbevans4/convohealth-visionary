import { TranscriptSegment } from "@/types/medical";
import { audioToBase64 } from "@/utils/formatters";
import { toast } from "sonner";

/**
 * Process audio with Google Speech-to-Text API through Supabase backend
 */
export const processWithGoogleSpeechToText = async (audioBlob: Blob): Promise<TranscriptSegment[]> => {
  try {
    console.log("Processing audio blob:", audioBlob);
    toast.loading("Processing audio...");
    
    // Convert audio to base64 for transmission
    const audioBase64 = await audioToBase64(audioBlob);
    
    // In production, this would be a call to your Supabase Edge Function
    // For example:
    // const { data, error } = await supabaseClient.functions.invoke('transcribe-audio', {
    //   body: { audio: audioBase64 }
    // });
    // if (error) throw new Error(`Supabase Function error: ${error.message}`);
    // return data;
    
    // Simulate Supabase function call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.dismiss();
    
    // Return simulated transcription for now
    // In production, this would be replaced with the actual response from Supabase
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
