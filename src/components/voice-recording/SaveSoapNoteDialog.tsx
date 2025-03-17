
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarClock } from 'lucide-react';

interface SaveSoapNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  defaultTitle?: string;
}

const SaveSoapNoteDialog: React.FC<SaveSoapNoteDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultTitle = '',
}) => {
  const [title, setTitle] = useState(defaultTitle || `Patient Consult - ${new Date().toLocaleDateString()}`);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save SOAP Note</DialogTitle>
          <DialogDescription>
            This note will be saved for 7 days and then automatically deleted.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this SOAP note"
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <CalendarClock className="h-4 w-4 shrink-0" />
            <p>This SOAP note will be available for 7 days.</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save SOAP Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveSoapNoteDialog;
