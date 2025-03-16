
import { TranscriptSegment } from "@/types/medical";
import { audioToBase64 } from "@/utils/formatters";
import { toast } from "sonner";
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
      .select('api_key, endpoint')
      .eq('name', 'google_speech_api')
      .eq('status', 'active')
      .maybeSingle();
    
    if (apiError || !apiData?.api_key) {
      console.error("Error fetching Google Speech API key:", apiError);
      console.log("Falling back to mock transcription data");
      toast.dismiss();
      toast.warning("Using simulated transcription. Add an API key in settings.");
      return simulateTranscriptionProcessing(audioBlob);
    }

    console.log("Successfully retrieved API key, calling speech-to-text service");
    
    try {
      // Call the Google Speech-to-Text API with the retrieved key
      const response = await fetch(apiData.endpoint || "https://speech.googleapis.com/v1/speech:recognize", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiData.api_key}`,
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
      
      // Process the API response
      if (response.ok) {
        const result = await response.json();
        toast.dismiss();
        toast.success("Audio processed successfully");
        
        // Transform the Google API response into our transcript format
        return transformGoogleResponse(result);
      } else {
        const result = await response.json();
        console.error("Google API error:", result.error || "Unknown error");
        throw new Error(`Google API error: ${result.error?.message || "Unknown error"}`);
      }
    } catch (callError) {
      console.error("Error calling Google Speech API:", callError);
      throw callError;
    }
    
  } catch (error) {
    console.error("Error with speech-to-text processing:", error);
    toast.dismiss();
    toast.error("Speech-to-text processing failed");
    
    // Fall back to mock data
    return simulateTranscriptionProcessing(audioBlob);
  }
};

/**
 * Transform Google Speech-to-Text API response to our transcript format
 */
const transformGoogleResponse = (googleResponse: any): TranscriptSegment[] => {
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

/**
 * This function simulates the transcription process for development
 */
export const simulateTranscriptionProcessing = async (audioBlob: Blob): Promise<TranscriptSegment[]> => {
  // In a real app, you would send the audio to a transcription service
  // For now, we'll simulate with mock data
  console.log("Simulating transcription for audio blob:", audioBlob);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Create mock transcript segments with medical conversation data
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
    },
    {
      id: "5",
      speaker: "Doctor",
      text: "Any history of migraines or other neurological conditions in your family?",
      startTime: 20.0,
      endTime: 24.5,
      confidence: 0.96
    },
    {
      id: "6",
      speaker: "Patient",
      text: "My mother had migraines, yes. I haven't had them before though.",
      startTime: 25.0,
      endTime: 30.0,
      confidence: 0.93
    },
    {
      id: "7",
      speaker: "Doctor",
      text: "Are you taking any medications currently? And have you tried anything for the headaches?",
      startTime: 31.0,
      endTime: 36.5,
      confidence: 0.97
    },
    {
      id: "8",
      speaker: "Patient",
      text: "Just some over-the-counter ibuprofen. It helps a little but doesn't completely take the pain away.",
      startTime: 37.0,
      endTime: 45.0,
      confidence: 0.91
    }
  ];
  
  return mockTranscript;
};
