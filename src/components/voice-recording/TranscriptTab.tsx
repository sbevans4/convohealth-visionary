
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TranscriptSegment } from "@/types/medical";

interface TranscriptTabProps {
  transcript: TranscriptSegment[];
}

const TranscriptTab: React.FC<TranscriptTabProps> = ({ transcript }) => {
  // Format the time (seconds) to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="border shadow-soft">
      <CardContent className="p-6">
        <div className="space-y-4">
          {transcript.map((segment) => (
            <div key={segment.id} className="flex gap-4">
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-medium h-fit",
                segment.speaker === "Doctor" 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-green-100 text-green-800"
              )}>
                {segment.speaker}
              </div>
              <div className="flex-1">
                <p className="text-base leading-relaxed">{segment.text}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TranscriptTab;
