/**
 * Format a date to a readable string
 * @param date - The date to format
 * @returns Formatted date string like "Jan 1, 2023"
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

/**
 * Format seconds into a minutes display
 * @param seconds - Duration in seconds
 * @returns Formatted duration string like "5 min"
 */
export const formatDuration = (seconds?: number): string => {
  if (!seconds) return '0 min';
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
};

/**
 * Format seconds into a MM:SS display
 * @param seconds - Duration in seconds
 * @returns Formatted duration string like "05:30"
 */
export const formatTimeMMSS = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Formats a date object into a date and time string
 */
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Converts an audio blob to base64 string
 */
export async function audioToBase64(blob: Blob): Promise<string> {
  if (!blob || blob.size === 0) {
    console.error("Invalid blob provided to audioToBase64: empty or null");
    throw new Error("Invalid audio blob: empty or null");
  }
  
  console.log(`Converting blob to base64: size=${blob.size} bytes, type=${blob.type}`);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    // Set a timeout in case the reader takes too long
    const timeout = setTimeout(() => {
      reject(new Error('Base64 conversion timeout'));
    }, 10000); // 10 second timeout
    
    reader.onloadend = () => {
      clearTimeout(timeout);
      
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
        const parts = reader.result.split(',');
        if (parts.length < 2) {
          console.error("Invalid FileReader result format");
          reject(new Error('Invalid base64 format'));
          return;
        }
        
        const base64 = parts[1];
        if (!base64 || base64.length === 0) {
          console.error("Empty base64 result");
          reject(new Error('Empty base64 result'));
          return;
        }
        
        console.log(`Successfully converted blob to base64 (length: ${base64.length})`);
        resolve(base64);
      } else {
        console.error("FileReader result is not a string");
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    
    reader.onerror = (error) => {
      clearTimeout(timeout);
      console.error("FileReader error:", error);
      reject(new Error(`FileReader error: ${error}`));
    };
    
    reader.onabort = () => {
      clearTimeout(timeout);
      console.error("FileReader operation aborted");
      reject(new Error('FileReader operation aborted'));
    };
    
    try {
      reader.readAsDataURL(blob);
    } catch (error) {
      clearTimeout(timeout);
      console.error("Error calling readAsDataURL:", error);
      reject(error);
    }
  });
}
