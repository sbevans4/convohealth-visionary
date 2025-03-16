
import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const ProcessingIndicator: React.FC = () => {
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
          <h3 className="text-xl font-semibold mb-2">Processing Your Recording</h3>
          <p className="text-muted-foreground mb-8 max-w-md">
            We're transcribing your conversation and generating a SOAP note. This usually takes about 30 seconds.
          </p>
          <div className="h-2 w-64 bg-medical-100 rounded-full overflow-hidden">
            <div className="h-full bg-medical-500 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProcessingIndicator;
