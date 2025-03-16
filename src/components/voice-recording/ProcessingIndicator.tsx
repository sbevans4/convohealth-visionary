
import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ProcessingIndicatorProps {
  currentPhase?: 'transcribing' | 'analyzing' | 'generating';
}

const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ 
  currentPhase = 'transcribing' 
}) => {
  // Get phase-specific content
  const phaseContent = {
    transcribing: {
      title: "Transcribing Your Recording",
      description: "Converting your conversation to text...",
      progress: 30
    },
    analyzing: {
      title: "Analyzing Conversation",
      description: "Identifying key medical information from your conversation...",
      progress: 60
    },
    generating: {
      title: "Generating SOAP Note",
      description: "Creating a structured clinical note based on your conversation...",
      progress: 85
    }
  };

  const content = phaseContent[currentPhase];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex justify-center py-12"
    >
      <div className="text-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-16 w-16 text-medical-500 animate-spin mb-6" />
          <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
          <p className="text-muted-foreground mb-8 max-w-md">
            {content.description}
          </p>
          <div className="h-2 w-64 bg-medical-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-medical-500 rounded-full transition-all duration-1000 ease-in-out" 
              style={{ width: `${content.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProcessingIndicator;
