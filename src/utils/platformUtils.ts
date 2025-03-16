
/**
 * Utility functions for platform-specific code
 */
export const isPlatform = (platform: 'android' | 'ios' | 'web'): boolean => {
  if (platform === 'web') {
    return !isNative();
  }
  
  // Check if running in Capacitor native container
  const userAgent = navigator.userAgent.toLowerCase();
  if (platform === 'android') {
    return isNative() && userAgent.indexOf('android') > -1;
  }
  if (platform === 'ios') {
    return isNative() && 
      (userAgent.indexOf('iphone') > -1 || 
       userAgent.indexOf('ipad') > -1 || 
       (navigator as any).userAgentData?.platform === 'macOS');
  }
  
  return false;
};

export const isNative = (): boolean => {
  return window.hasOwnProperty('Capacitor');
};

/**
 * Handle Android back button
 * @param callback Function to execute when back button is pressed
 */
export const handleAndroidBackButton = (callback: () => void) => {
  if (isPlatform('android') && (window as any).Capacitor?.Plugins?.App) {
    const { App } = (window as any).Capacitor.Plugins;
    const backButtonHandler = App.addListener('backButton', () => {
      callback();
    });
    
    return () => {
      backButtonHandler.remove();
    };
  }
  
  return () => {}; // No-op for non-Android platforms
};

/**
 * Request permissions needed for the app
 */
export const requestAppPermissions = async () => {
  if (!isNative()) return { microphone: true };
  
  try {
    const { Permissions } = (window as any).Capacitor.Plugins;
    
    // Request microphone permission for recording
    const microphoneStatus = await Permissions.query({ name: 'microphone' });
    
    if (microphoneStatus.state !== 'granted') {
      const requestResult = await Permissions.request({ name: 'microphone' });
      return { microphone: requestResult.state === 'granted' };
    }
    
    return { microphone: true };
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return { microphone: false };
  }
};

/**
 * Check if device is connected to the internet
 */
export const isOnline = async (): Promise<boolean> => {
  if (!isNative()) return navigator.onLine;
  
  try {
    const { Network } = (window as any).Capacitor.Plugins;
    const status = await Network.getStatus();
    return status.connected;
  } catch (error) {
    console.error('Error checking network status:', error);
    return navigator.onLine; // Fallback to browser API
  }
};
