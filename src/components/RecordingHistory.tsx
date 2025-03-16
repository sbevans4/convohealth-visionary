
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Recording } from "@/types/medical";
import { formatDateTime, formatDuration } from "@/utils/formatters";
import { Mic, FileText, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";

interface RecordingHistoryProps {
  recordings: Recording[];
  onSelect: (recording: Recording) => void;
  onDelete: (id: string) => void;
}

const RecordingHistory = ({ 
  recordings, 
  onSelect, 
  onDelete 
}: RecordingHistoryProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (recording: Recording) => {
    setSelectedId(recording.id);
    onSelect(recording);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
    toast.success("Recording deleted");
  };

  if (!recordings.length) {
    return (
      <Card className="border shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Recording History</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Calendar className="h-10 w-10 mb-2 opacity-30" />
            <p>No recordings found</p>
            <p className="text-sm">Your recording history will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg">Recording History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recordings.map((recording) => (
            <div 
              key={recording.id}
              onClick={() => handleSelect(recording)}
              className={`
                flex items-center justify-between p-3 rounded-lg border 
                transition-colors cursor-pointer 
                ${selectedId === recording.id ? 'bg-accent/80 border-primary/30' : 'hover:bg-accent/50'}
              `}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-medical-100 text-medical-600">
                  <Mic className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{recording.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      {formatDateTime(recording.date)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDuration(recording.duration)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {recording.soapNote && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(recording);
                    }}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 px-2 text-destructive hover:text-destructive"
                  onClick={(e) => handleDelete(recording.id, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordingHistory;
