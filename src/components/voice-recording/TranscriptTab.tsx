
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TranscriptSegment } from "@/types/medical";
import { formatDuration } from "@/utils/formatters";

interface TranscriptTabProps {
  transcript: TranscriptSegment[];
}

const TranscriptTab: React.FC<TranscriptTabProps> = ({ transcript }) => {
  return (
    <Card className="border shadow-soft">
      <CardContent className="p-6">
        <div className="space-y-4">
          {transcript.map((segment) => (
            <div key={segment.id} className="flex gap-4">
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-medium h-fit",
                segment.speaker === "Doctor" 
                  ? "bg-medical-100 text-medical-800" 
                  : "bg-green-100 text-green-800"
              )}>
                {segment.speaker}
              </div>
              <div className="flex-1">
                <p className="text-base leading-relaxed">{segment.text}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDuration(segment.startTime)} - {formatDuration(segment.endTime)}
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
