
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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
const analytics = getAnalytics(app);

export { app, analytics };
