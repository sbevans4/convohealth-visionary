import { TranscriptSegment } from "@/types/medical";
import { audioToBase64 } from "@/utils/formatters";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Default API config - use this as fallback
const DEFAULT_API_CONFIG = {
  api_key: "JWOW9fkQkG5QxIdAqwRTcpRb3otp1OhE",
  endpoint: "https://api.lemonfox.ai/v1/audio/transcriptions"
};

/**
 * Initialize and update LemonFox API configuration in the database
 */
export const initializeLemonFoxApi = async () => {
  try {
    // First check if the apis table exists
    const { error: tableCheckError } = await supabase
      .from('apis')
      .select('count(*)', { count: 'exact', head: true })
      .limit(1);
    
    if (tableCheckError && tableCheckError.code === '42P01') {
      console.log("The apis table doesn't exist yet. Using default API configuration.");
      return;
    }
    
    // If table exists, check if entry exists
    const { data, error } = await supabase
      .from('apis')
      .select('id, endpoint')
      .eq('name', 'lemonfox_api')
      .maybeSingle();
    
    const correctEndpoint = "https://api.lemonfox.ai/v1/audio/transcriptions";
    
    if (error || !data) {
      // Create new entry
      await supabase
        .from('apis')
        .insert({
          name: 'lemonfox_api',
          api_key: DEFAULT_API_CONFIG.api_key,
          status: 'active',
          endpoint: correctEndpoint
        });
      console.log("Created new LemonFox API entry with correct endpoint");
    } else if (data.endpoint !== correctEndpoint) {
      // Update existing entry with correct endpoint
      await supabase
        .from('apis')
        .update({ endpoint: correctEndpoint })
        .eq('id', data.id);
      console.log("Updated existing LemonFox API endpoint to:", correctEndpoint);
    } else {
      console.log("LemonFox API endpoint is already correct:", data.endpoint);
    }
  } catch (err) {
    console.error("Error initializing LemonFox API:", err);
  }
};

// Don't auto-initialize - this will be called by setupApiKeys
// initializeLemonFoxApi();

/**
 * Fetch LemonFox API configuration from Supabase
 */
export const getLemonFoxApiConfig = async (): Promise<{ api_key: string; endpoint: string }> => {
  try {
    // First try to get the key from the database
    const { data, error } = await supabase
      .from('apis')
      .select('api_key, endpoint')
      .eq('name', 'lemonfox_api')
      .eq('status', 'active')
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching LemonFox API key:", error);
      
      // If the error is that the table doesn't exist, return the default config
      if (error.code === '42P01') {
        console.log("APIs table doesn't exist yet, using default LemonFox API config");
        return DEFAULT_API_CONFIG;
      }
      
      // For any other error, fall back to default config
      return DEFAULT_API_CONFIG;
    }
    
    // If we have a key in the database, use that
    if (data?.api_key) {
      return {
        api_key: data.api_key,
        endpoint: data.endpoint || DEFAULT_API_CONFIG.endpoint
      };
    }
    
    // Fallback to the default key if no key is found in the database
    console.log("Using fallback LemonFox API key");
    return DEFAULT_API_CONFIG;
  } catch (err) {
    console.error("Error in getLemonFoxApiConfig:", err);
    // Fallback to the default key if there's an error
    return DEFAULT_API_CONFIG;
  }
};

/**
 * Call the LemonFox API with audio data
 */
export const callLemonFoxApi = async (audioBase64: string): Promise<any> => {
  // Get API config, will always return something (default config if necessary)
  const apiConfig = await getLemonFoxApiConfig();
  
  console.log("Calling LemonFox API with endpoint:", apiConfig.endpoint);
  
  try {
    // Create FormData as required by the LemonFox API
    const formData = new FormData();
    
    // Convert base64 to Blob
    const byteCharacters = atob(audioBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'audio/webm' });
    
    // Append file to FormData
    formData.append('file', blob, 'recording.webm');
    
    // Optional parameters
    formData.append('response_format', 'verbose_json');
    formData.append('language', 'en');
    formData.append('speaker_labels', 'true');
    
    const response = await fetch(apiConfig.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiConfig.api_key}`
        // Do not set Content-Type header when using FormData
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("LemonFox API error response:", errorText);
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(`LemonFox API error: ${JSON.stringify(errorJson)}`);
      } catch (e) {
        throw new Error(`LemonFox API error: ${errorText || response.statusText || "Unknown error"}`);
      }
    }
    
    return response.json();
  } catch (error) {
    console.error("Error calling LemonFox API:", error);
    throw error;
  }
};

/**
 * Transform LemonFox API response to our transcript format
 */
export const transformLemonFoxResponse = (response: any): TranscriptSegment[] => {
  if (!response || !response.segments || response.segments.length === 0) {
    console.error("Invalid or empty response from LemonFox API:", response);
    return [];
  }
  
  const transcript: TranscriptSegment[] = [];
  let idCounter = 1;
  
  // Process the transcript data from LemonFox
  response.segments.forEach((segment: any) => {
    if (!segment.text) return;
    
    // Determine speaker - LemonFox uses numbers for speakers (0, 1, etc.)
    const speaker = segment.speaker !== undefined ? 
      (parseInt(segment.speaker) === 0 ? "Doctor" : "Patient") : 
      "Unknown";
    
    // Calculate timestamps
    const startTime = segment.start;
    const endTime = segment.end;
    
    transcript.push({
      id: idCounter.toString(),
      speaker: speaker,
      text: segment.text.trim(),
      startTime: startTime,
      endTime: endTime,
      confidence: segment.confidence || 0.9 // Default confidence
    });
    
    idCounter++;
  });
  
  return transcript;
};
