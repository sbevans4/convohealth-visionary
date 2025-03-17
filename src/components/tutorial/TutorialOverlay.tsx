
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Image, 
  LayoutDashboard, 
  CreditCard, 
  Settings,
  CheckCircle
} from 'lucide-react';
import TutorialStep from './TutorialStep';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useTutorial } from '@/hooks/useTutorial';

interface TutorialOverlayProps {
  open: boolean;
  onClose: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ open, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { skipTutorial } = useTutorial();
  
  const tutorialSteps = [
    {
      title: 'Welcome to ConvoNotes',
      description: 'Let\'s take a quick tour to help you get started with this powerful medical documentation tool.',
      icon: LayoutDashboard
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
      title: 'Subscription Management',
      description: 'Easily manage your subscription plan and billing information from your account.',
      icon: CreditCard
    },
    {
      title: 'You\'re All Set!',
      description: 'Start using ConvoNotes to save hours on documentation. You can access this tutorial anytime from settings.',
      icon: CheckCircle
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
    skipTutorial();
    onClose();
  };
  
  const handleSkip = () => {
    skipTutorial();
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
          {open && (
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
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialOverlay;
