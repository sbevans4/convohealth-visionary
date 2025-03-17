
import { supabase } from "@/integrations/supabase/client";

// Cleanup expired SOAP notes
export async function cleanupExpiredSoapNotes() {
  try {
    // Call the cleanup function we created in the database
    const { data, error } = await supabase.rpc('cleanup_expired_soap_notes');
    
    if (error) {
      console.error("Error cleaning up expired SOAP notes:", error);
    } else {
      console.log("Expired SOAP notes cleanup completed");
    }
  } catch (err) {
    console.error("Error in SOAP notes cleanup process:", err);
  }
}

// Initialize a periodic cleanup process (runs once a day)
export function initializeCleanupScheduler() {
  // Clean up expired notes on app initialization
  cleanupExpiredSoapNotes();
  
  // Schedule daily cleanup
  const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
  
  // Set up interval for regular cleanup
  const intervalId = setInterval(() => {
    cleanupExpiredSoapNotes();
  }, CLEANUP_INTERVAL);
  
  // Return a function to clear the interval if needed
  return () => clearInterval(intervalId);
}
