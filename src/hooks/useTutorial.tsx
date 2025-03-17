
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface TutorialHookResult {
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
  resetTutorial: () => void;
  skipTutorial: () => void;
  hasTutorialBeenCompleted: () => boolean;
}

export const useTutorial = (forceShow = false): TutorialHookResult => {
  const [showTutorial, setShowTutorial] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    // Check if user is new (tutorial not completed)
    const tutorialCompleted = localStorage.getItem('tutorialCompleted') === 'true';
    const isFirstVisit = !tutorialCompleted;
    
    // Show tutorial if it's the first visit or if forced to show
    // Don't show on landing page or auth pages
    if ((isFirstVisit || forceShow) && 
        !location.pathname.match(/^\/(|auth|privacy-policy|terms|hipaa)$/)) {
      // Slight delay to allow the page to load
      const timer = setTimeout(() => setShowTutorial(true), 800);
      return () => clearTimeout(timer);
    }
  }, [forceShow, location.pathname]);
  
  const resetTutorial = () => {
    localStorage.removeItem('tutorialCompleted');
    setShowTutorial(true);
  };
  
  const skipTutorial = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    setShowTutorial(false);
  };
  
  const hasTutorialBeenCompleted = () => {
    return localStorage.getItem('tutorialCompleted') === 'true';
  };

  return {
    showTutorial,
    setShowTutorial,
    resetTutorial,
    skipTutorial,
    hasTutorialBeenCompleted
  };
};
