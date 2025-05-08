import { FileText, Mic, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/utils/formatters";
import { SavedSoapNote } from "@/types/medical";
import { Link } from "react-router-dom";

const RecentRecording = ({ recording }: { recording: SavedSoapNote }) => {
  const hasNotes = Boolean(
    recording.subjective &&
    recording.objective &&
    recording.assessment &&
    recording.plan
  );

  const formatTime = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-background hover:bg-accent/50 transition-colors gap-3">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-medical-100 text-medical-600 shrink-0">
          <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-sm sm:text-base truncate">{recording.title}</h4>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
            <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
              <Clock className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
              {formatTime(recording.created_at)}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {formatDuration(recording.recording_duration || 0)}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:mt-0 mt-3 sm:ml-0 ml-auto w-full sm:w-auto">
        {hasNotes ? (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs sm:text-sm w-full sm:w-auto mb-2 sm:mb-0"
            asChild
          >
            <Link to={`/medical-documentation/${recording.id}`} className="flex items-center justify-center w-full">
              <FileText className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="whitespace-nowrap">View SOAP Note</span>
            </Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs sm:text-sm w-full sm:w-auto"
            asChild
          >
            <Link to={`/voice-recording?from_id=${recording.id}`} className="flex items-center justify-center w-full">
              <Plus className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="whitespace-nowrap">Generate Note</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecentRecording;
