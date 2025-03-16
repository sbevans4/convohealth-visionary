
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
