
import { TranscriptSegment } from "@/types/medical";

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
