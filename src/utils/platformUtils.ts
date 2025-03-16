
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

/**
 * Rate the app on the play store
 */
export const rateApp = () => {
  if (!isPlatform('android')) return;
  
  try {
    const { App } = (window as any).Capacitor.Plugins;
    const appPackageName = "app.lovable.5c493edebbc343deb1d23a7209345528"; 
    
    // Open Google Play Store page for the app
    App.openUrl({
      url: `market://details?id=${appPackageName}`
    }).catch(() => {
      // If market URL fails, open web URL
      App.openUrl({
        url: `https://play.google.com/store/apps/details?id=${appPackageName}`
      });
    });
  } catch (error) {
    console.error('Error opening app store for rating:', error);
  }
};

/**
 * Share app with others
 */
export const shareApp = async (message: string = "Check out ConvoHealth Visionary!") => {
  if (!isNative()) return;
  
  try {
    const { Share } = (window as any).Capacitor.Plugins;
    await Share.share({
      title: "ConvoHealth Visionary",
      text: message,
      url: "https://play.google.com/store/apps/details?id=app.lovable.5c493edebbc343deb1d23a7209345528",
      dialogTitle: "Share ConvoHealth Visionary"
    });
  } catch (error) {
    console.error('Error sharing app:', error);
  }
};

/**
 * Check if this is a production build
 */
export const isProduction = (): boolean => {
  return import.meta.env.MODE === 'production';
};

/**
 * Get app version from native platform
 */
export const getAppVersion = async (): Promise<string> => {
  if (!isNative()) return "web";
  
  try {
    const { App } = (window as any).Capacitor.Plugins;
    const info = await App.getInfo();
    return info.version;
  } catch (error) {
    console.error('Error getting app version:', error);
    return "unknown";
  }
};
