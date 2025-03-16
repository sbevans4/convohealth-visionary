
import { FileText, Mic, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/utils/formatters";

interface RecordingProps {
  id: string;
  title: string;
  date: Date;
  duration: number;
  hasNotes: boolean;
}

const RecentRecording = ({ recording }: { recording: RecordingProps }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-background hover:bg-accent/50 transition-colors">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-full bg-medical-100 text-medical-600">
          <Mic className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-medium">{recording.title}</h4>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-3.5 w-3.5" />
              {recording.date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDuration(recording.duration)}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center mt-4 md:mt-0">
        {recording.hasNotes ? (
          <Button variant="outline" size="sm" className="h-8">
            <FileText className="mr-1 h-3.5 w-3.5" />
            View SOAP Note
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="h-8">
            <Plus className="mr-1 h-3.5 w-3.5" />
            Generate Note
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecentRecording;
