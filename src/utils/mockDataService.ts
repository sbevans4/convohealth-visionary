import { Recording, SoapNote, UserProfile, SubscriptionPlan } from "@/types/medical";

// Mock recordings data
const mockRecordings: Recording[] = [
  {
    id: "rec-001",
    title: "Initial Consultation - Jane Doe",
    date: new Date(2023, 5, 23, 10, 30),
    duration: 845,
    soapNote: {
      subjective: "Patient reports experiencing headaches and dizziness for the past week. The headaches are intermittent and typically worse in the morning.",
      objective: "Vital signs stable. Alert and oriented x3. No visible signs of trauma.",
      assessment: "Suspected tension headache, possibly related to stress or poor sleep hygiene.",
      plan: "Recommend over-the-counter analgesics as needed for pain. Advised to maintain proper hydration and sleep schedule."
    }
  },
  {
    id: "rec-002",
    title: "Follow-up - Michael Smith",
    date: new Date(2023, 5, 21, 14, 15),
    duration: 620,
    soapNote: {
      subjective: "Patient reports improvement in respiratory symptoms following the prescribed antibiotic course. No more fever or night sweats.",
      objective: "Temperature 98.6°F. Lungs clear to auscultation. No rales or rhonchi.",
      assessment: "Resolving pneumonia, responding well to antibiotics.",
      plan: "Complete the full course of antibiotics. Return in 2 weeks for follow-up chest X-ray."
    }
  },
  {
    id: "rec-003",
    title: "Medication Review - Alex Johnson",
    date: new Date(2023, 5, 18, 9, 0),
    duration: 730,
    soapNote: {
      subjective: "Patient reports difficulty managing multiple medications for hypertension and diabetes. Occasional missed doses.",
      objective: "BP 142/88, HR 76, regular. Blood glucose 165 mg/dL (fingerstick).",
      assessment: "Suboptimal control of hypertension and type 2 diabetes, partly due to medication compliance issues.",
      plan: "Simplify medication regimen to once-daily dosing where possible. Provide pill organizer and medication schedule chart."
    }
  }
];

// Mock user profile
const mockUserProfile: UserProfile = {
  id: "user-001",
  name: "Dr. Thomas Chen",
  email: "dr.chen@example.com",
  role: "physician",
  specialty: "Internal Medicine",
  subscriptionTier: "premium",
  subscriptionExpiresAt: new Date(2024, 0, 1)
};

// Mock subscription plans
const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "plan-free",
    name: "Free",
    price: 0,
    interval: "month",
    features: [
      "5 recordings per month",
      "Basic transcription",
      "Manual SOAP note creation",
      "7-day data retention"
    ]
  },
  {
    id: "plan-basic",
    name: "Basic",
    price: 99,
    interval: "month",
    features: [
      "Up to 5 hours of recordings per month",
      "Basic SOAP note generation",
      "7-day storage retention",
      "Email support"
    ]
  },
  {
    id: "plan-professional",
    name: "Professional",
    price: 499,
    interval: "month",
    recommended: true,
    features: [
      "Up to 20 hours of recordings per month",
      "Advanced SOAP note generation",
      "30-day storage retention",
      "Medical image analysis",
      "Priority support"
    ]
  },
  {
    id: "plan-enterprise",
    name: "Enterprise",
    price: 1999,
    interval: "month",
    features: [
      "For up to 6 providers",
      "Unlimited recordings",
      "Custom AI model training",
      "EHR integration",
      "HIPAA BAA included",
      "Dedicated account manager"
    ]
  }
];

// Mock API functions
export const getRecordings = (): Promise<Recording[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockRecordings]);
    }, 500);
  });
};

export const saveRecording = (recording: Omit<Recording, "id">): Promise<Recording> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRecording: Recording = {
        ...recording,
        id: `rec-${Date.now()}`
      };
      mockRecordings.unshift(newRecording);
      resolve(newRecording);
    }, 800);
  });
};

export const deleteRecording = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockRecordings.findIndex(rec => rec.id === id);
      if (index !== -1) {
        mockRecordings.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 300);
  });
};

export const getUserProfile = (): Promise<UserProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({...mockUserProfile});
    }, 400);
  });
};

export const getSubscriptionPlans = (): Promise<SubscriptionPlan[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockSubscriptionPlans]);
    }, 300);
  });
};
