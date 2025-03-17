
import { isPlatform, requestAppPermissions } from './platformUtils';

/**
 * Initialize mobile-specific adaptations
 */
export const initMobileApp = async () => {
  if (isPlatform('android')) {
    console.log('Running on Android device');
    
    // Request required permissions
    const permissions = await requestAppPermissions();
    if (!permissions.microphone) {
      console.warn('Microphone permission denied - recording functionality may not work');
    }
    
    // Handle hardware back button
    setupAndroidBackButton();
    
    // Apply mobile optimizations
    applyMobileOptimizations();
  }
};

/**
 * Setup Android hardware back button handler
 */
const setupAndroidBackButton = () => {
  if (!isPlatform('android')) return;
  
  try {
    const { App } = (window as any).Capacitor.Plugins;
    
    App.addListener('backButton', ({ canGoBack }: { canGoBack: boolean }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        // Handle back button when at the root of the app navigation
        App.minimizeApp();
      }
    });
  } catch (error) {
    console.error('Error setting up Android back button:', error);
  }
};

/**
 * Apply optimizations for mobile devices
 */
const applyMobileOptimizations = () => {
  // Prevent pull-to-refresh behavior which can interfere with the app
  document.body.style.overscrollBehavior = 'none';
  
  // Force hardware acceleration
  document.body.style.transform = 'translateZ(0)';
  
  // Prevent text size adjustment
  document.body.style.webkitTextSizeAdjust = '100%';
  
  // Add mobile-specific class for CSS targeting
  document.documentElement.classList.add('capacitor-platform-android');
};

/**
 * Check if app was launched from Android intent
 */
export const checkDeepLink = async () => {
  if (!isPlatform('android')) return null;
  
  try {
    const { App } = (window as any).Capacitor.Plugins;
    const appUrlOpen = await App.getLaunchUrl();
    
    if (appUrlOpen && appUrlOpen.url) {
      return new URL(appUrlOpen.url);
    }
    
    return null;
  } catch (error) {
    console.error('Error checking deep link:', error);
    return null;
  }
};
