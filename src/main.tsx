
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './integrations/firebase/config' // Import Firebase configuration

createRoot(document.getElementById("root")!).render(<App />);
