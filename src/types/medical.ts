
export interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface TranscriptSegment {
  id: string;
  speaker: string;
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

export interface Recording {
  id: string;
  title: string;
  date: Date;
  duration: number;
  transcriptUrl?: string;
  soapNote?: SoapNote;
}

export interface SavedSoapNote {
  id: string;
  title: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  transcript_data?: TranscriptSegment[] | null;
  created_at: Date;
  expires_at: Date;
  recording_duration?: number;
  user_id?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'physician' | 'nurse' | 'assistant' | 'admin';
  specialty?: string;
  avatar?: string;
  subscriptionTier: 'free' | 'basic' | 'premium' | 'enterprise';
  subscriptionExpiresAt?: Date;
  referralCode?: string;
  referralCount?: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  recommended?: boolean;
}
