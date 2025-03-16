
import React from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SoapNote } from "@/types/medical";
import { Sparkles } from "lucide-react";

interface SoapNoteTabProps {
  soapNote: SoapNote;
  onUpdateSoapNote: (updatedNote: SoapNote) => void;
}

const SoapNoteTab: React.FC<SoapNoteTabProps> = ({ soapNote, onUpdateSoapNote }) => {
  return (
    <Card className="border shadow-soft">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">SOAP Note</h3>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            AI Generated
          </div>
        </div>
        
        <Accordion type="single" collapsible defaultValue="subjective" className="w-full">
          <AccordionItem value="subjective">
            <AccordionTrigger className="text-base font-medium">
              Subjective
            </AccordionTrigger>
            <AccordionContent>
              <Textarea 
                value={soapNote.subjective} 
                onChange={(e) => onUpdateSoapNote({...soapNote, subjective: e.target.value})}
                className="min-h-24 resize-none"
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="objective">
            <AccordionTrigger className="text-base font-medium">
              Objective
            </AccordionTrigger>
            <AccordionContent>
              <Textarea 
                value={soapNote.objective} 
                onChange={(e) => onUpdateSoapNote({...soapNote, objective: e.target.value})}
                className="min-h-24 resize-none"
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="assessment">
            <AccordionTrigger className="text-base font-medium">
              Assessment
            </AccordionTrigger>
            <AccordionContent>
              <Textarea 
                value={soapNote.assessment} 
                onChange={(e) => onUpdateSoapNote({...soapNote, assessment: e.target.value})}
                className="min-h-24 resize-none"
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="plan">
            <AccordionTrigger className="text-base font-medium">
              Plan
            </AccordionTrigger>
            <AccordionContent>
              <Textarea 
                value={soapNote.plan} 
                onChange={(e) => onUpdateSoapNote({...soapNote, plan: e.target.value})}
                className="min-h-24 resize-none"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default SoapNoteTab;
