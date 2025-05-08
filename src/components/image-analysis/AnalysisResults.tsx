import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Info, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface AnalysisResultsProps {
  results: {
    findings: string;
    suggestedCodes: string[];
  };
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-4 sm:space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <Card className="px-3 py-4 sm:p-6 bg-white shadow-md">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <h3 className="font-semibold text-base sm:text-lg">Clinical Findings</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 gap-1 text-xs"
                  onClick={() => copyToClipboard(results.findings)}
                >
                  <ClipboardCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  Copy
                </Button>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{results.findings}</p>
            </div>
          </div>
        </Card>
      </motion.div>
      
      <motion.div variants={item}>
        <Card className="px-3 py-4 sm:p-6 bg-white shadow-md">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
              <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <h3 className="font-semibold text-base sm:text-lg">Suggested Diagnostic Codes</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 gap-1 text-xs"
                  onClick={() => copyToClipboard(results.suggestedCodes.join(', '))}
                >
                  <ClipboardCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  Copy All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {results.suggestedCodes.map((code, index) => (
                  <div 
                    key={index} 
                    className="group relative bg-purple-50 border border-purple-100 text-purple-800 px-2.5 py-1.5 rounded-md text-xs sm:text-sm hover:bg-purple-100 transition-colors cursor-pointer"
                    onClick={() => copyToClipboard(code)}
                  >
                    {code}
                    <span className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-100 text-[10px] py-0.5 px-1.5 rounded-full">
                      Click to copy
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
      
      <motion.div variants={item} className="text-center pt-1 sm:pt-2">
        <p className="text-xs sm:text-sm text-muted-foreground px-2 sm:px-0">
          Note: These suggestions are AI-generated. Please verify with your clinical judgment.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AnalysisResults;
