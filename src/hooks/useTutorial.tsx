
import { useState, useEffect } from 'react';

interface TutorialHookResult {
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
  resetTutorial: () => void;
  skipTutorial: () => void;
  hasTutorialBeenCompleted: () => boolean;
}

export const useTutorial = (forceShow = false): TutorialHookResult => {
  const [showTutorial, setShowTutorial] = useState(false);
  
  useEffect(() => {
    // Check if user is new (tutorial not completed)
    const tutorialCompleted = localStorage.getItem('tutorialCompleted') === 'true';
    const isFirstVisit = !tutorialCompleted;
    
    // Show tutorial if it's the first visit or if forced to show
    if ((isFirstVisit || forceShow) && window.location.pathname !== '/') {
      // Slight delay to allow the page to load
      const timer = setTimeout(() => setShowTutorial(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [forceShow]);
  
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
