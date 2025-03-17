
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, TicketX, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSoapNotes } from '@/hooks/useSoapNotes';
import { SavedSoapNote } from '@/types/medical';
import SavedSoapNotesList from '@/components/voice-recording/SavedSoapNotesList';
import SavedSoapNoteDetail from '@/components/voice-recording/SavedSoapNoteDetail';
import { Link } from 'react-router-dom';

const SavedSoapNotes = () => {
  const { savedNotes, isLoading, error, deleteSoapNote } = useSoapNotes();
  const [selectedNote, setSelectedNote] = useState<SavedSoapNote | null>(null);
  
  const handleViewNote = (note: SavedSoapNote) => {
    setSelectedNote(note);
  };
  
  const handleDeleteNote = (id: string) => {
    deleteSoapNote.mutate(id);
  };
  
  const handleBack = () => {
    setSelectedNote(null);
  };
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <TicketX className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-xl font-semibold mb-2">Failed to load SOAP notes</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          There was an error loading your saved SOAP notes. Please try again later.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {selectedNote ? (
        <SavedSoapNoteDetail note={selectedNote} onBack={handleBack} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-semibold tracking-tight">Saved SOAP Notes</h1>
              <p className="text-muted-foreground">
                View your saved SOAP notes (available for 7 days)
              </p>
            </div>
            
            <Button asChild>
              <Link to="/voice-recording">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Recording
              </Link>
            </Button>
          </div>
          
          <SavedSoapNotesList
            notes={savedNotes || []}
            isLoading={isLoading}
            onViewNote={handleViewNote}
            onDeleteNote={handleDeleteNote}
          />
        </motion.div>
      )}
    </div>
  );
};

export default SavedSoapNotes;
