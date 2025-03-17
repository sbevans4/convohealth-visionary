
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Copy, CheckCircle, Gift } from "lucide-react";
import { toast } from "sonner";

const ReferralSystem = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  
  // Generate referral code based on user ID (or a portion of it)
  const referralCode = user?.id ? `${user.id.substring(0, 8)}` : 'Loading...';
  
  // Base URL for referral link
  const baseUrl = window.location.origin;
  const referralLink = `${baseUrl}/auth?ref=${referralCode}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  
  return (
    <Card className="border border-dashed border-primary/50 bg-primary/5 mb-8">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Refer a Colleague, Get 10% Off
        </CardTitle>
        <CardDescription>
          Share your referral link with colleagues. For each signup, you'll receive 10% off your next month's subscription!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input 
            value={referralLink}
            readOnly
            className="bg-background border-primary/20"
          />
          <Button
            variant="outline" 
            size="icon"
            className="shrink-0 border-primary/20"
            onClick={copyToClipboard}
          >
            {copied ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>10% off for one month per referral</span>
          </p>
          <p className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Discounts stack up to 50% off maximum</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralSystem;
