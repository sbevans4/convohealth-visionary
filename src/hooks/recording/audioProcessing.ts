
import { TranscriptSegment } from "@/types/medical";
import { audioToBase64 } from "@/utils/formatters";
import { toast } from "sonner";

/**
 * Process audio with Google Speech-to-Text API
 */
export const processWithGoogleSpeechToText = async (audioBlob: Blob): Promise<TranscriptSegment[]> => {
  try {
    // Get API key from localStorage
    let apiKey = null;
    try {
      const storedKeys = localStorage.getItem('api_keys');
      if (storedKeys) {
        const keys = JSON.parse(storedKeys);
        apiKey = keys.googleSpeechApiKey;
      }
    } catch (error) {
      console.error("Error retrieving API key from localStorage:", error);
    }
    
    // If no API key, throw error to fall back to mock data
    if (!apiKey) {
      throw new Error("No Google Speech API key configured");
    }
    
    // Convert audio to base64
    const audioBase64 = await audioToBase64(audioBlob);
    
    // Prepare request to Google Speech-to-Text API
    const response = await fetch(`https://speech.googleapis.com/v1p1beta1/speech:recognize?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          languageCode: 'en-US',
          enableAutomaticPunctuation: true,
          enableSpeakerDiarization: true,
          diarizationSpeakerCount: 2, // Assuming doctor and patient
          model: 'medical_conversation'
        },
        audio: {
          content: audioBase64
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google Speech API error:", errorData);
      throw new Error(`Google Speech API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Google Speech API response:", data);
    
    // Process the response and convert to our TranscriptSegment format
    const transcriptSegments: TranscriptSegment[] = [];
    
    if (data.results) {
      let startTime = 0;
      
      data.results.forEach((result: any, index: number) => {
        if (result.alternatives && result.alternatives.length > 0) {
          const transcript = result.alternatives[0].transcript;
          const confidence = result.alternatives[0].confidence;
          
          // Calculate approximate timing (this is simplified)
          const wordCount = transcript.split(' ').length;
          const approxDuration = wordCount * 0.5; // Rough estimate of seconds per word
          
          transcriptSegments.push({
            id: `${index + 1}`,
            // Alternate between doctor and patient for simplicity
            speaker: index % 2 === 0 ? "Doctor" : "Patient",
            text: transcript,
            startTime,
            endTime: startTime + approxDuration,
            confidence
          });
          
          startTime += approxDuration;
        }
      });
    }
    
    return transcriptSegments;
    
  } catch (error) {
    console.error("Error with Google Speech-to-Text:", error);
    if ((error as Error).message.includes("No Google Speech API key configured")) {
      toast.error("Please configure your Google Speech API key");
    } else {
      toast.error("Speech-to-text processing failed");
    }
    
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
