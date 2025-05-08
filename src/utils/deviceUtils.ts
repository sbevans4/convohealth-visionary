/**
 * Utility functions for checking device capabilities.
 */

/**
 * Checks if the device has camera support
 * @returns A promise that resolves to true if camera is available, false otherwise
 */
export const checkCameraAvailability = async (): Promise<boolean> => {
  // First check if the browser supports mediaDevices API
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return false;
  }

  try {
    // Check if there are any video input devices
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    
    if (videoDevices.length === 0) {
      return false;
    }

    // Try to access the camera but release it immediately
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: true,
      audio: false
    });
    
    // If we got here, camera access is available
    // Make sure to stop all tracks to release the camera
    stream.getTracks().forEach(track => track.stop());
    
    return true;
  } catch (error) {
    console.error('Error checking camera availability:', error);
    return false;
  }
};

/**
 * Returns true if the device is a mobile device
 */
export const isMobileDevice = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  return (
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
    (navigator.maxTouchPoints > 0 && /macintosh/i.test(userAgent)) // iPad OS 13+
  );
};

/**
 * Checks if the device has touch support
 */
export const hasTouchSupport = (): boolean => {
  return 'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    (navigator.msMaxTouchPoints > 0);
}; 