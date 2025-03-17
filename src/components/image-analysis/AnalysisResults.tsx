
import React from 'react';

interface AnalysisResultsProps {
  results: {
    findings: string;
    suggestedCodes: string[];
  };
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-lg">Findings</h3>
        <p className="mt-1 text-muted-foreground">{results.findings}</p>
      </div>
      
      <div>
        <h3 className="font-medium text-lg">Suggested Codes</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {results.suggestedCodes.map((code, index) => (
            <div key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
              {code}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
