
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SoapNote, TranscriptSegment, SavedSoapNote } from '@/types/medical';
import { toast } from 'sonner';

export function useSoapNotes() {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  // Fetch saved SOAP notes
  const { data: savedNotes, isLoading, error } = useQuery({
    queryKey: ['soapNotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('soap_notes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(note => ({
        ...note,
        created_at: new Date(note.created_at),
        expires_at: new Date(note.expires_at)
      })) as SavedSoapNote[];
    },
  });

  // Save a SOAP note
  const saveSoapNote = useCallback(async (
    soapNote: SoapNote, 
    transcript: TranscriptSegment[],
    title: string,
    duration?: number
  ) => {
    setIsSaving(true);
    
    try {
      const { data, error } = await supabase
        .from('soap_notes')
        .insert({
          title,
          subjective: soapNote.subjective,
          objective: soapNote.objective,
          assessment: soapNote.assessment,
          plan: soapNote.plan,
          transcript_data: transcript,
          recording_duration: duration || 0
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      toast.success('SOAP note saved successfully');
      
      // Invalidate the query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ['soapNotes'],
      });
      
      return {
        ...data,
        created_at: new Date(data.created_at),
        expires_at: new Date(data.expires_at)
      } as SavedSoapNote;
    } catch (error) {
      console.error('Error saving SOAP note:', error);
      toast.error('Failed to save SOAP note');
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [queryClient]);

  // Delete a SOAP note
  const deleteSoapNote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('soap_notes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return id;
    },
    onSuccess: (id) => {
      toast.success('SOAP note deleted');
      queryClient.invalidateQueries({
        queryKey: ['soapNotes'],
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
