
import React from "react";
import { motion } from "framer-motion";
import { Copy, Download, Share2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecordingHeaderProps {
  recordingStatus: 'idle' | 'recording' | 'paused' | 'processing' | 'complete';
  onCopy: () => void;
  onSave: () => void;
}

const RecordingHeader: React.FC<RecordingHeaderProps> = ({
  recordingStatus,
  onCopy,
  onSave
}) => {
  const isSessionActive = recordingStatus === 'complete';

  if (!isSessionActive) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-display font-semibold tracking-tight">Voice Recording</h1>
        <p className="text-muted-foreground">
          Record and transcribe patient conversations automatically
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-display font-semibold tracking-tight">Voice Recording</h1>
        <p className="text-muted-foreground">
          Record and transcribe patient conversations automatically
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2"
      >
        <Button variant="outline" size="sm" onClick={onCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </Button>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button variant="default" size="sm" onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </motion.div>
    </div>
  );
};

export default RecordingHeader;
