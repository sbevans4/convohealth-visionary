import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/hooks/useSubscription";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/utils/formatters";
import { useState } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SubscriptionStatusCard = () => {
  const { 
    getUserSubscriptionTier, 
    trialDaysRemaining, 
    recordingMinutesUsed,
    getRecordingMinutesRemaining,
    TRIAL_MINUTES_LIMIT,
    isTrialExpired,
    trialStartDate,
    repairRecordingDurations
  } = useSubscription();
  
  const [isRepairing, setIsRepairing] = useState(false);
  
  const subscriptionTier = getUserSubscriptionTier();
  const recordingMinutesRemaining = getRecordingMinutesRemaining();
  const recordingUsagePercentage = Math.min(
    100,
    ((recordingMinutesUsed / 60) / TRIAL_MINUTES_LIMIT) * 100
  );
  
  
  // Calculate trial end date
  const trialEndDate = trialStartDate ? new Date(trialStartDate) : new Date();
  if (trialStartDate) {
    trialEndDate.setDate(trialEndDate.getDate() + 15);
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Function to handle repair
  const handleRepair = async () => {
    setIsRepairing(true);
    try {
      await repairRecordingDurations();
    } finally {
      setIsRepairing(false);
    }
  };
  
  // Whether the usage data might be incorrect (when usage is exactly at the limit)
  const mightHaveDataIssue = recordingMinutesUsed >= TRIAL_MINUTES_LIMIT;

  return (
    <motion.div variants={itemVariants}>
      <Card className="border shadow-soft h-full p-3 sm:p-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl">Subscription Status</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Current plan and usage information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-secondary rounded-lg">
            <div>
              <h4 className="font-medium text-base sm:text-lg">
                {isTrialExpired() ? 'Trial Expired' : 'Free Trial'}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isTrialExpired() 
                  ? 'Your trial has ended' 
                  : `${trialDaysRemaining} days remaining (expires ${formatDate(trialEndDate)})`}
              </p>
            </div>
            <Button size="sm" className="w-full sm:w-auto" asChild>
              <Link to="/subscription">Upgrade</Link>
            </Button>
          </div>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1 sm:gap-0">
              <div className="flex items-center gap-1">
                <span className="text-xs sm:text-sm font-medium">Recording Usage</span>
                {mightHaveDataIssue && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Recording usage data may be incorrect</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {(recordingMinutesRemaining / 60).toFixed(1)}/{TRIAL_MINUTES_LIMIT} minutes
              </span>
            </div>
            <Progress value={recordingUsagePercentage} className="h-2" />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1 gap-1 sm:gap-0">
              <p className="text-xs text-muted-foreground">
                {isTrialExpired() 
                  ? 'Trial limit reached' 
                  : `${recordingMinutesRemaining.toFixed(1)} minutes remaining in trial`}
              </p>
              {mightHaveDataIssue && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-6 text-xs px-2 mt-1 sm:mt-0"
                  onClick={handleRepair}
                  disabled={isRepairing}
                >
                  {isRepairing ? (
                    <>
                      <RefreshCcw className="h-3 w-3 mr-1 animate-spin" />
                      Fixing...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="h-3 w-3 mr-1" />
                      Fix Usage Data
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SubscriptionStatusCard;
