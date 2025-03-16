
import React from "react";
import { motion } from "framer-motion";
import { Copy, Download, Share2, Save, Check, Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDuration } from "@/utils/formatters";

interface RecordingHeaderProps {
  recordingStatus: 'idle' | 'recording' | 'paused' | 'processing' | 'complete';
  recordingTime: number;
  onCopy: () => void;
  onSave: () => void;
}

const RecordingHeader: React.FC<RecordingHeaderProps> = ({
  recordingStatus,
  recordingTime,
  onCopy,
  onSave
}) => {
  const isSessionActive = recordingStatus !== 'idle' && recordingStatus !== 'recording' && recordingStatus !== 'paused';

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
    <>
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
        
        {recordingStatus === 'complete' && (
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
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border shadow-soft bg-background">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center">
                  <Input 
                    value="Patient Encounter - Jane Doe" 
                    className="border-none text-lg font-medium p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0" 
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    {new Date().toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Duration: {formatDuration(recordingTime)}
                  </div>
                </div>
              </div>
              {recordingStatus === 'complete' && (
                <div className="flex items-center mt-4 md:mt-0">
                  <div className="bg-green-100 text-green-700 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium">
                    <Check className="h-3.5 w-3.5" />
                    Processing Complete
                  </div>
                </div>
              )}
              {recordingStatus === 'processing' && (
                <div className="flex items-center mt-4 md:mt-0">
                  <div className="bg-blue-100 text-blue-700 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Processing Audio
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default RecordingHeader;
