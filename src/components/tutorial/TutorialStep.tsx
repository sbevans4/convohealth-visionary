
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LucideIcon, ChevronRight, ChevronLeft, X } from 'lucide-react';

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
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="bg-card text-card-foreground rounded-lg p-6 max-w-md mx-auto"
    >
      <div className="absolute top-3 right-3">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onSkip}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-col items-center pt-4">
        <div className="bg-primary/10 p-4 rounded-full mb-5">
          <Icon className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-center">{title}</h3>
        <p className="text-center text-muted-foreground mb-8 max-w-xs">{description}</p>
        
        <div className="flex items-center justify-center gap-1.5 mb-8 w-full">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i + 1 === step 
                  ? 'bg-primary w-6' 
                  : i + 1 < step 
                    ? 'bg-primary/60 w-4' 
                    : 'bg-muted w-4'
              }`}
            />
          ))}
        </div>
        
        <div className="flex w-full justify-between">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={onPrevious}
            disabled={step === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSkip} 
            className="text-muted-foreground hover:text-foreground"
          >
            Skip
          </Button>
          
          <Button size="sm" className="gap-1" onClick={onNext}>
            {step === totalSteps ? 'Finish' : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TutorialStep;
