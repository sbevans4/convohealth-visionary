
import { TranscriptSegment } from "@/types/medical";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, User } from "lucide-react";
import { formatDuration } from "@/utils/formatters";

interface TranscriptViewerProps {
  transcript: TranscriptSegment[];
  title?: string;
}

const TranscriptViewer = ({ transcript, title = "Conversation Transcript" }: TranscriptViewerProps) => {
  if (!transcript.length) {
    return (
      <Card className="border shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-12">
          No transcript data available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {transcript.map((segment, index) => (
              <div key={segment.id} className="flex gap-3">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  segment.speaker === "Doctor" ? "bg-medical-100 text-medical-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {segment.speaker === "Doctor" ? (
                    <Mic className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="font-medium text-sm">{segment.speaker}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDuration(segment.startTime)}
                    </span>
                  </div>
                  <p className="text-sm">{segment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TranscriptViewer;
