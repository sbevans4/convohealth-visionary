
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Sparkles, Calendar, Clock } from 'lucide-react';
import { SavedSoapNote } from '@/types/medical';
import { formatDuration } from '@/utils/formatters';
import TranscriptTab from './TranscriptTab';

interface SavedSoapNoteDetailProps {
  note: SavedSoapNote;
  onBack: () => void;
}

const SavedSoapNoteDetail: React.FC<SavedSoapNoteDetailProps> = ({ note, onBack }) => {
  // Get days until expiration
  const getDaysUntilExpiration = (expiresAt: Date) => {
    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiration = getDaysUntilExpiration(note.expires_at);

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-semibold">{note.title}</h2>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {note.created_at.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            {note.recording_duration && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {formatDuration(note.recording_duration)}
              </div>
            )}
            <div className="text-sm text-amber-600">
              Expires in {daysUntilExpiration} {daysUntilExpiration === 1 ? 'day' : 'days'}
            </div>
          </div>
        </div>
      </div>

      <Card className="border shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">SOAP Note</h3>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              AI Generated
            </div>
          </div>
          
          <Accordion type="single" collapsible defaultValue="subjective" className="w-full">
            <AccordionItem value="subjective">
              <AccordionTrigger className="text-base font-medium">
                Subjective
              </AccordionTrigger>
              <AccordionContent>
                <div className="whitespace-pre-wrap p-3 bg-muted/50 rounded-md">
                  {note.subjective}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="objective">
              <AccordionTrigger className="text-base font-medium">
                Objective
              </AccordionTrigger>
              <AccordionContent>
                <div className="whitespace-pre-wrap p-3 bg-muted/50 rounded-md">
                  {note.objective}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="assessment">
              <AccordionTrigger className="text-base font-medium">
                Assessment
              </AccordionTrigger>
              <AccordionContent>
                <div className="whitespace-pre-wrap p-3 bg-muted/50 rounded-md">
                  {note.assessment}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="plan">
              <AccordionTrigger className="text-base font-medium">
                Plan
              </AccordionTrigger>
              <AccordionContent>
                <div className="whitespace-pre-wrap p-3 bg-muted/50 rounded-md">
                  {note.plan}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {note.transcript_data && note.transcript_data.length > 0 && (
        <Card className="border shadow-soft">
          <CardHeader className="pb-0">
            <CardTitle>Transcript</CardTitle>
            <CardDescription>Original conversation transcript</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <TranscriptTab transcript={note.transcript_data} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SavedSoapNoteDetail;
