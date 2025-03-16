
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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'physician' | 'nurse' | 'assistant' | 'admin';
  specialty?: string;
  avatar?: string;
  subscriptionTier: 'free' | 'basic' | 'premium' | 'enterprise';
  subscriptionExpiresAt?: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  recommended?: boolean;
}
