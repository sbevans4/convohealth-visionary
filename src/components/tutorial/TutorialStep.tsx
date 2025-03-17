
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

export interface TutorialStepProps {
  title: string;
  description: string;
  icon: LucideIcon;
  step: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

const TutorialStep: React.FC<TutorialStepProps> = ({
  title,
  description,
  icon: Icon,
  step,
  totalSteps,
  onNext,
  onPrevious,
  onSkip
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-card text-card-foreground rounded-lg shadow-lg p-6 max-w-md mx-auto"
    >
      <div className="flex flex-col items-center">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <Icon className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-center text-muted-foreground mb-6">{description}</p>
        
        <div className="flex items-center justify-center gap-2 mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i} 
              className={`h-2 w-2 rounded-full ${i + 1 <= step ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>
        
        <div className="flex w-full justify-between">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={step === 1}
          >
            Previous
          </Button>
          
          <Button variant="ghost" onClick={onSkip}>
            Skip Tutorial
          </Button>
          
          <Button onClick={onNext}>
            {step === totalSteps ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TutorialStep;
