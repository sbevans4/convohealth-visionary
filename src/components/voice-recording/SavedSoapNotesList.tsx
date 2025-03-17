
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Trash2, Calendar, Clock } from 'lucide-react';
import { SavedSoapNote } from '@/types/medical';
import { formatDuration } from '@/utils/formatters';

interface SavedSoapNotesListProps {
  notes: SavedSoapNote[];
  onViewNote: (note: SavedSoapNote) => void;
  onDeleteNote: (id: string) => void;
  isLoading?: boolean;
}

const SavedSoapNotesList: React.FC<SavedSoapNotesListProps> = ({
  notes,
  onViewNote,
  onDeleteNote,
  isLoading = false,
}) => {
  // Calculate days until expiration
  const getDaysUntilExpiration = (expiresAt: Date) => {
    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-medium text-lg mb-2">No saved SOAP notes</h3>
        <p className="text-muted-foreground max-w-md">
          When you save SOAP notes from your recordings, they will appear here. Notes are stored for 7 days.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {notes.map((note) => {
        const daysUntilExpiration = getDaysUntilExpiration(note.expires_at);
        
        return (
          <Card key={note.id} className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{note.title}</CardTitle>
              <CardDescription>
                Created on {note.created_at.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric'
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Expires in {daysUntilExpiration} {daysUntilExpiration === 1 ? 'day' : 'days'}</span>
                </div>
                {note.recording_duration && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatDuration(note.recording_duration)}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2 pt-0">
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1"
                onClick={() => onViewNote(note)}
              >
                <FileText className="mr-2 h-4 w-4" />
                View SOAP Note
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteNote(note.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default SavedSoapNotesList;
