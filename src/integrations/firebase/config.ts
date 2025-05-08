// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClNPIgtbZg3FQwTE3xttC5mQyiYgJeehk",
  authDomain: "ai-doctor-notes.firebaseapp.com",
  projectId: "ai-doctor-notes",
  storageBucket: "ai-doctor-notes.firebasestorage.app",
  messagingSenderId: "254909682996",
  appId: "1:254909682996:web:dce01e2b5dc02b38498161"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only if supported and not in development mode
let analytics = null;
const initAnalytics = async () => {
  try {
    // Check if analytics is supported in this environment
    const isAnalyticsSupported = await isSupported();
    
    // Only initialize analytics if supported and not in development
    if (isAnalyticsSupported && process.env.NODE_ENV !== 'development') {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized successfully');
    } else {
      console.log('Firebase Analytics not initialized: either unsupported or in development mode');
    }
  } catch (error) {
    console.error('Error initializing Firebase Analytics:', error);
  }
};

// Initialize analytics
initAnalytics();

export { app, analytics };
