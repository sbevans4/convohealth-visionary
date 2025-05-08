import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SoapNote, SavedSoapNote, TranscriptSegment } from '@/types/medical';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function useSoapNotes() {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth(); // Get the current authenticated user

  // Fetch saved SOAP notes for the current user
  const { data: savedNotes, isLoading, error } = useQuery({
    queryKey: ['soapNotes', user?.id],
    queryFn: async () => {
      // Only fetch notes if user is authenticated
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('soap_notes')
        .select('*')
        .eq('user_id', user.id) // Filter notes by user_id
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert the database response to our SavedSoapNote type
      return data.map(note => ({
        ...note,
        created_at: new Date(note.created_at),
        expires_at: new Date(note.expires_at),
        // Handle transcript_data conversion - ensure it's a TranscriptSegment[] or null
        transcript_data: note.transcript_data as unknown as TranscriptSegment[] | null
      })) as SavedSoapNote[];
    },
    // Only run the query if the user is authenticated
    enabled: !!user,
  });

  // Save a SOAP note
  const saveSoapNote = useCallback(async (
    soapNote: SoapNote, 
    transcript: TranscriptSegment[],
    title: string,
    duration?: number
  ) => {
    // Check if user is authenticated
    if (!user) {
      toast.error('You must be logged in to save SOAP notes');
      return null;
    }
    
    setIsSaving(true);
    
    try {
      // Convert transcript to JSON for storage
      const { data, error } = await supabase
        .from('soap_notes')
        .insert({
          title,
          subjective: soapNote.subjective,
          objective: soapNote.objective,
          assessment: soapNote.assessment,
          plan: soapNote.plan,
          transcript_data: transcript as unknown as any, // Cast to any to satisfy TypeScript
          recording_duration: duration || 0,
          user_id: user.id // Add the user_id to the saved note
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      toast.success('SOAP note saved successfully');
       
      // Invalidate the query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ['soapNotes', user.id],
      });
      
      // Convert the response to our SavedSoapNote type
      return {
        ...data,
        created_at: new Date(data.created_at),
        expires_at: new Date(data.expires_at),
        transcript_data: data.transcript_data as unknown as TranscriptSegment[] | null
      } as SavedSoapNote;
    } catch (error) {
      console.error('Error saving SOAP note:', error);
      toast.error('Failed to save SOAP note');
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [queryClient, user]);

  // Delete a SOAP note
  const deleteSoapNote = useMutation({
    mutationFn: async (id: string) => {
      // Check if user is authenticated
      if (!user) {
        throw new Error('You must be logged in to delete SOAP notes');
      }
      
      const { error } = await supabase
        .from('soap_notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Ensure user can only delete their own notes
      
      if (error) throw error;
      
      return id;
    },
    onSuccess: (id) => {
      toast.success('SOAP note deleted');
      queryClient.invalidateQueries({
        queryKey: ['soapNotes', user?.id],
      });
    },
    onError: (error) => {
      console.error('Error deleting SOAP note:', error);
      toast.error('Failed to delete SOAP note');
    }
  });

  return {
    savedNotes,
    isLoading,
    error,
    isSaving,
    saveSoapNote,
    deleteSoapNote
  };
}
