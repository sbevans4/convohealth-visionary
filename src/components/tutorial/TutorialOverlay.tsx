
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Image, 
  Home, 
  CreditCard, 
  Settings,
  X
} from 'lucide-react';
import TutorialStep from './TutorialStep';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface TutorialOverlayProps {
  open: boolean;
  onClose: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ open, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const tutorialSteps = [
    {
      title: 'Welcome to AI Doctor Notes',
      description: 'Let\'s take a quick tour to help you get started with this powerful medical documentation tool.',
      icon: Home
    },
    {
      title: 'Voice Recording',
      description: 'Record patient conversations and automatically generate structured SOAP notes using AI.',
      icon: Mic
    },
    {
      title: 'Image Analysis',
      description: 'Upload medical images for AI-powered analysis and automatic code suggestions.',
      icon: Image
    },
    {
      title: 'Subscription Plans',
      description: 'Choose a plan that fits your needs, from basic to premium with advanced features.',
      icon: CreditCard
    },
    {
      title: 'You\'re All Set!',
      description: 'You can access this tutorial anytime from your account settings. Happy documenting!',
      icon: Settings
    }
  ];

  const totalSteps = tutorialSteps.length;
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleFinish = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    onClose();
  };
  
  const handleSkip = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    onClose();
  };

  // Reset to first step when dialog opens
  useEffect(() => {
    if (open) {
      setCurrentStep(1);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-md" hideCloseButton>
        <AnimatePresence mode="wait">
          <TutorialStep
            key={currentStep}
            title={tutorialSteps[currentStep - 1].title}
            description={tutorialSteps[currentStep - 1].description}
            icon={tutorialSteps[currentStep - 1].icon}
            step={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSkip={handleSkip}
          />
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialOverlay;
