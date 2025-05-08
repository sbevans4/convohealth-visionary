import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSoapNotes } from '@/hooks/useSoapNotes';
import { SavedSoapNote } from '@/types/medical';
import { Link } from 'react-router-dom';
import { formatDate, formatDuration } from '@/utils/formatters';
import { toast } from 'sonner';

const MedicalDocumentation = () => {
  const { savedNotes, isLoading, deleteSoapNote } = useSoapNotes();
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      try {
        deleteSoapNote.mutate(id, {
          onSuccess: () => {
            toast.success('Note deleted successfully');
          },
          onError: (error) => {
            console.error('Failed to delete note:', error);
            toast.error('Failed to delete note');
          }
        });
      } catch (error) {
        console.error('Failed to delete note:', error);
        toast.error('Failed to delete note');
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
        <div className="text-left sm:w-3/4">
          <h1 className="text-3xl font-bold">Medical Documentation</h1>
          <p className="text-muted-foreground">
            View and manage your saved SOAP notes and transcripts
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:w-auto">
          <Button asChild>
            <Link to="/voice-recording">Create New Recording</Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : !savedNotes || savedNotes.length === 0 ? (
        <Card className="border shadow-soft p-8 text-center">
          <div className="py-12">
            <h2 className="text-xl font-semibold mb-2">No saved notes found</h2>
            <p className="text-muted-foreground mb-6">
              You haven't saved any medical documentation yet. Create a new voice recording to generate and save SOAP notes.
            </p>
            <Button asChild>
              <Link to="/voice-recording">Create Your First Recording</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedNotes.map((note: SavedSoapNote) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border shadow-soft h-full flex flex-col">
              <CardHeader>
                <CardTitle>{note.title}</CardTitle>
                <CardDescription>
                  {formatDate(note.created_at)} • {formatDuration(note.recording_duration)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold">Subjective</h3>
                    <p className="text-sm line-clamp-2">{note.subjective}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Assessment</h3>
                    <p className="text-sm line-clamp-2">{note.assessment}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row sm:justify-between pt-2 gap-2">
                <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                  <Link to={`/view-note/${note.id}`} className="w-full sm:w-auto">
                    View Details
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="w-full sm:w-auto" onClick={() => handleDelete(note.id)}>
                  Delete
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      
      )}
    </div>
  );
};

export default MedicalDocumentation;
