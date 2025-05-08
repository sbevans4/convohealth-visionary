import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { SavedSoapNote } from '@/types/medical';
import { useSoapNotes } from './useSoapNotes';
import { useSubscription } from './useSubscription';

interface UseDashboardStatsReturn {
  isLoading: boolean;
  error: Error | null;
  recordingsThisMonth: number;
  monthlyChange: number; // percentage change from last month
  documentationTimeSaved: string; // formatted as "00h 00m"
  soapNotesGenerated: number;
  soapNotesPercentage: number; // percentage of recordings with SOAP notes
  imageAnalyses: number;
  imageAnalysesChange: number; // percentage change from last month
  recentRecordings: SavedSoapNote[];
}

export function useDashboardStats(): UseDashboardStatsReturn {
  const { user } = useAuth();
  const { savedNotes, isLoading: isNotesLoading } = useSoapNotes();
  const { recordingMinutesUsed } = useSubscription();
  
  // Query for fetching user statistics
  const { data: stats, isLoading: isStatsLoading, error } = useQuery({
    queryKey: ['dashboardStats', user?.id],
    queryFn: async () => {
      if (!user) {
        return {
          recordingsTotal: 0,
          recordingsLastMonth: 0,
          recordingsThisMonth: 0,
          imageAnalysesTotal: 0,
          imageAnalysesLastMonth: 0,
          imageAnalysesThisMonth: 0,
        };
      }
      
      try {
        // In a real implementation, you would fetch this from your analytics backend
        // For now, we'll derive it from the saved notes
        
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
        
        // Get recordings counts
        const { data: recordingsData, error: recordingsError } = await supabase
          .from('soap_notes')
          .select('id, created_at')
          .eq('user_id', user.id);
          
        if (recordingsError) throw recordingsError;
        
        const recordings = recordingsData || [];
        
        // Count recordings for this month, last month, and total
        const recordingsThisMonth = recordings.filter(rec => {
          const date = new Date(rec.created_at);
          return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
        }).length;
        
        const recordingsLastMonth = recordings.filter(rec => {
          const date = new Date(rec.created_at);
          return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        }).length;
        
        // For image analyses, we'd typically have a separate table or flag
        // For this example, we'll simulate with random data based on recordings
        const imageAnalysesTotal = Math.floor(recordings.length * 0.4); // 40% of recordings have image analyses
        const imageAnalysesThisMonth = Math.floor(recordingsThisMonth * 0.4);
        const imageAnalysesLastMonth = Math.floor(recordingsLastMonth * 0.4);
        
        return {
          recordingsTotal: recordings.length,
          recordingsLastMonth,
          recordingsThisMonth,
          imageAnalysesTotal,
          imageAnalysesLastMonth,
          imageAnalysesThisMonth,
        };
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
      }
    },
    enabled: !!user,
  });
  
  // Calculate documentation time saved (estimated based on recording length)
  const calculateTimeSaved = (): string => {
    if (!savedNotes || savedNotes.length === 0) return '0h 00m';
    
    // Calculate total recording duration in minutes
    const totalRecordingMinutes = savedNotes.reduce((total, note) => {
      // Ensure we have a valid duration
      const duration = typeof note.recording_duration === 'number' && note.recording_duration > 0 
        ? note.recording_duration 
        : 0;
      return total + duration;
    }, 0);
    
    // Ensure we're dealing with a positive number
    if (totalRecordingMinutes <= 0) return '0h 00m';
    
    // Assume manual documentation takes 4x the recording time
    // This is based on industry research showing that manual documentation
    // typically takes 3-5x longer than the actual patient interaction
    const timeSavedFactor = 4;
    const totalMinutesSaved = (totalRecordingMinutes / 60) * (timeSavedFactor - 1); // Subtract 1x for the time spent recording
    
    const hours = Math.floor(totalMinutesSaved / 60);
    const minutes = Math.round(totalMinutesSaved % 60);
    
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  };
  
  // Calculate monthly change percentage
  const calculateMonthlyChange = (): number => {
    if (!stats) return 0;
    
    const { recordingsThisMonth, recordingsLastMonth } = stats;
    
    if (recordingsLastMonth === 0) return recordingsThisMonth > 0 ? 100 : 0;
    
    return Math.round(((recordingsThisMonth - recordingsLastMonth) / recordingsLastMonth) * 100);
  };
  
  // Calculate SOAP notes percentage
  const calculateSoapNotesPercentage = (): number => {
    if (!stats || !savedNotes) return 0;
    
    const recordingsWithSoapNotes = savedNotes.filter(note => 
      note.subjective && note.objective && note.assessment && note.plan
    ).length;
    
    return stats.recordingsTotal === 0 
      ? 0 
      : Math.round((recordingsWithSoapNotes / stats.recordingsTotal) * 100);
  };
  
  // Calculate image analyses change
  const calculateImageAnalysesChange = (): number => {
    if (!stats) return 0;
    
    const { imageAnalysesThisMonth, imageAnalysesLastMonth } = stats;
    
    if (imageAnalysesLastMonth === 0) return imageAnalysesThisMonth > 0 ? 100 : 0;
    
    return Math.round(((imageAnalysesThisMonth - imageAnalysesLastMonth) / imageAnalysesLastMonth) * 100);
  };
  
  // Get recent recordings (last 3)
  const getRecentRecordings = (): SavedSoapNote[] => {
    if (!savedNotes) return [];
    
    // Sort by creation date (descending) and take the first 3
    return [...savedNotes]
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, 3);
  };
  
  // Return the dashboard stats
  return {
    isLoading: isStatsLoading || isNotesLoading,
    error: error as Error | null,
    recordingsThisMonth: stats?.recordingsThisMonth || 0,
    monthlyChange: calculateMonthlyChange(),
    documentationTimeSaved: calculateTimeSaved(),
    soapNotesGenerated: savedNotes?.length || 0,
    soapNotesPercentage: calculateSoapNotesPercentage(),
    imageAnalyses: stats?.imageAnalysesTotal || 0,
    imageAnalysesChange: calculateImageAnalysesChange(),
    recentRecordings: getRecentRecordings(),
  };
} 