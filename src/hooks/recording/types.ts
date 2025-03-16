
import { TranscriptSegment, SoapNote } from "@/types/medical";

export interface UseRecordingOptions {
  onTranscriptionReady?: (transcript: TranscriptSegment[]) => void;
  onSoapNoteReady?: (soapNote: SoapNote) => void;
}

export type ProcessingPhase = 'idle' | 'transcribing' | 'analyzing' | 'generating' | 'complete';

export interface RecordingState {
  isRecording: boolean;
  recordingTime: number;
  transcript: TranscriptSegment[];
  isProcessing: boolean;
  processingPhase: ProcessingPhase;
  soapNote: SoapNote | null;
}
