
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/hooks/useSubscription";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/utils/formatters";

const SubscriptionStatusCard = () => {
  const { 
    getUserSubscriptionTier, 
    trialDaysRemaining, 
    recordingMinutesUsed,
    getRecordingMinutesRemaining,
    TRIAL_MINUTES_LIMIT,
    isTrialExpired,
    trialStartDate
  } = useSubscription();
  
  const subscriptionTier = getUserSubscriptionTier();
  const recordingMinutesRemaining = getRecordingMinutesRemaining();
  const recordingUsagePercentage = (recordingMinutesUsed / TRIAL_MINUTES_LIMIT) * 100;
  
  // Calculate trial end date
  const trialEndDate = trialStartDate ? new Date(trialStartDate) : new Date();
  if (trialStartDate) {
    trialEndDate.setDate(trialEndDate.getDate() + 15);
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="border shadow-soft h-full">
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>Current plan and usage information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div>
              <h4 className="font-medium">
                {isTrialExpired() ? 'Trial Expired' : 'Free Trial'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isTrialExpired() 
                  ? 'Your trial has ended' 
                  : `${trialDaysRemaining} days remaining (expires ${formatDate(trialEndDate)})`}
              </p>
            </div>
            <Button size="sm" asChild>
              <Link to="/subscription">Upgrade</Link>
            </Button>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Recording Usage</span>
              <span className="text-sm text-muted-foreground">
                {recordingMinutesUsed.toFixed(1)}/{TRIAL_MINUTES_LIMIT} minutes
              </span>
            </div>
            <Progress value={recordingUsagePercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {isTrialExpired() 
                ? 'Trial limit reached' 
                : `${recordingMinutesRemaining.toFixed(1)} minutes remaining in trial`}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SubscriptionStatusCard;
