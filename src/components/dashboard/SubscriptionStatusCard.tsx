
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/hooks/useSubscription";

const SubscriptionStatusCard = () => {
  const { getUserSubscriptionTier } = useSubscription();
  const subscriptionTier = getUserSubscriptionTier();
  
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
                {subscriptionTier === 'free' ? 'Free Access' : 'Professional Plan'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {subscriptionTier === 'free' ? 
                  'All features available in demo mode' : 
                  'Renews on July 15, 2023'}
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
                {subscriptionTier === 'free' ? 'Unlimited in demo mode' : '12.5/20 hours'}
              </span>
            </div>
            <div className="h-2 rounded-full bg-secondary">
              <div className="h-2 rounded-full bg-medical-500" style={{ width: '62.5%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {subscriptionTier === 'free' ? 
                'Full access granted for demonstration' : 
                '7.5 hours remaining this month'}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SubscriptionStatusCard;
