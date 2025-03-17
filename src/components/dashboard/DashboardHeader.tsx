import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import FeedbackButton from '@/components/feedback/FeedbackButton';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  rightContent?: React.ReactNode;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
  backButtonLabel?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  description, 
  rightContent,
  showBackButton = false,
  onBackButtonClick,
  backButtonLabel
}) => {
  const isMobile = useMobile();

  return (
    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0 pb-6">
      <div className="flex items-center">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBackButtonClick}
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {backButtonLabel || 'Back'}
          </Button>
        )}

        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!isMobile && <FeedbackButton />}
        {rightContent}
      </div>
    </div>
  );
};

export default DashboardHeader;
