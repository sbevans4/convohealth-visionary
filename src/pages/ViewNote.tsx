import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clipboard, Trash2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSoapNotes } from '@/hooks/useSoapNotes';
import { SavedSoapNote, TranscriptSegment } from '@/types/medical';
import { formatDate, formatDuration } from '@/utils/formatters';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ViewNote = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { savedNotes, deleteSoapNote } = useSoapNotes();
  const [note, setNote] = useState<SavedSoapNote | null>(null);
  const [activeTab, setActiveTab] = useState('soap');
  const [error, setError] = useState<string | null>(null);

  // Try to get the note from savedNotes first
  useEffect(() => {
    if (savedNotes) {
      const foundNote = savedNotes.find(note => note.id === id);
      if (foundNote) {
        setNote(foundNote);
      }
    }
  }, [id, savedNotes]);

  // If not found in savedNotes, fetch directly from the database
  const { isLoading } = useQuery({
    queryKey: ['soapNote', id, user?.id],
    queryFn: async () => {
      // Only fetch if we don't already have the note, have an ID, and a user
      if (note || !id || !user) return null;
      
      try {
        const { data, error } = await supabase
          .from('soap_notes')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id) // Ensure user can only see their own notes
          .single();
        
        if (error) {
          console.error('Error fetching note:', error);
          setError('Failed to load the note. It may have been deleted or you do not have permission to access it.');
          return null;
        }
        
        if (data) {
          // Convert to SavedSoapNote format
          const formattedNote = {
            ...data,
            created_at: new Date(data.created_at),
            expires_at: new Date(data.expires_at),
            transcript_data: data.transcript_data as unknown as TranscriptSegment[] | null
          } as SavedSoapNote;
          
          setNote(formattedNote);
          return formattedNote;
        } else {
          setError('Note not found. It may have been deleted.');
          return null;
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred while loading the note.');
        return null;
      }
    },
    // Only run if we don't have the note yet and user is authenticated
    enabled: !note && !!id && !!user,
    retry: 1, // Only retry once to prevent multiple error messages
  });

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      try {
        deleteSoapNote.mutate(id, {
          onSuccess: () => {
            toast.success('Note deleted successfully');
            navigate('/medical-documentation');
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

  const handleCopy = () => {
    if (!note) return;
    
    const soapText = `SUBJECTIVE:\n${note.subjective}\n\nOBJECTIVE:\n${note.objective}\n\nASSESSMENT:\n${note.assessment}\n\nPLAN:\n${note.plan}`;
    navigator.clipboard.writeText(soapText);
    toast.success('SOAP note copied to clipboard');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/medical-documentation')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Back to All Notes</span>
          </Button>
        </div>
        <Card className="border shadow-soft p-6 sm:p-8 text-center">
          <div className="py-8 sm:py-12">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">{error || 'Note not found'}</h2>
            <p className="text-muted-foreground mb-6">
              {!error && 'The note you\'re looking for doesn\'t exist or has been deleted.'}
            </p>
            <Button asChild>
              <Link to="/medical-documentation">Return to All Notes</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-8 px-4"
    >
      {/* Improved Header Section */}
      <div className="flex flex-col space-y-4 mb-6 sm:mb-8">
        <div className="flex items-start">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="mr-2 sm:mr-4"
            aria-label="Back to notes"
          >
            <Link to="/medical-documentation">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Back</span>
            </Link>
          </Button>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold truncate">{note.title}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {formatDate(note.created_at)} • {formatDuration(note.recording_duration)}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCopy}
          className="w-full sm:w-auto sm:flex-none"
        >
          <Clipboard className="h-4 w-4 sm:mr-2" />
          <span className="sr-only sm:not-sr-only">Copy to Clipboard</span>
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleDelete}
          className="w-full sm:w-auto sm:flex-none"
        >
          <Trash2 className="h-4 w-4 sm:mr-2" />
          <span className="sr-only sm:not-sr-only">Delete Note</span>
        </Button>
      </div>
      </div>

      <Tabs defaultValue="soap" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-6 sm:mb-8 w-full flex flex-wrap">
        <TabsTrigger value="soap" className="w-1/2">
          SOAP Note
        </TabsTrigger>
        <TabsTrigger value="transcript" className="w-1/2">
          Transcript
        </TabsTrigger>
      </TabsList>


        <TabsContent value="soap" className="space-y-4 sm:space-y-6">
          <Card className="border shadow-soft">
            <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
              <CardTitle className="text-lg sm:text-xl">Subjective</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3 sm:px-6 sm:py-4">
              <p className="whitespace-pre-wrap text-sm sm:text-base">{note.subjective}</p>
            </CardContent>
          </Card>
          
          <Card className="border shadow-soft">
            <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
              <CardTitle className="text-lg sm:text-xl">Objective</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3 sm:px-6 sm:py-4">
              <p className="whitespace-pre-wrap text-sm sm:text-base">{note.objective}</p>
            </CardContent>
          </Card>
          
          <Card className="border shadow-soft">
            <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
              <CardTitle className="text-lg sm:text-xl">Assessment</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3 sm:px-6 sm:py-4">
              <p className="whitespace-pre-wrap text-sm sm:text-base">{note.assessment}</p>
            </CardContent>
          </Card>
          
          <Card className="border shadow-soft">
            <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
              <CardTitle className="text-lg sm:text-xl">Plan</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3 sm:px-6 sm:py-4">
              <p className="whitespace-pre-wrap text-sm sm:text-base">{note.plan}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transcript">
          <Card className="border shadow-soft">
            <CardContent className="p-4 sm:p-6">
              {note.transcript_data && note.transcript_data.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {note.transcript_data.map((segment: TranscriptSegment, index) => (
                    <div key={segment.id || index} className="pb-3 sm:pb-4 border-b last:border-b-0">
                      <p className="font-medium text-xs sm:text-sm mb-1">
                        {segment.speaker === 'patient' ? 'Patient' : 'Provider'}
                      </p>
                      <p className="text-sm sm:text-base">{segment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-6 sm:py-8 text-sm sm:text-base">
                  No transcript available for this recording
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ViewNote;