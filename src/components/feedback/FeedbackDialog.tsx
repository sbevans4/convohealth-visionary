
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import FeedbackForm from './FeedbackForm';

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            Your feedback helps us improve our service. Tell us about your experience.
          </DialogDescription>
        </DialogHeader>
        
        <FeedbackForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
