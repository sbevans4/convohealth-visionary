import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Copy, CheckCircle, Gift } from "lucide-react";
import { toast } from "sonner";

const ReferralSystem = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralCode = user?.id ? user.id.substring(0, 8) : "Loading...";
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const referralLink = `${baseUrl}/auth?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");

    setTimeout(() => setCopied(false), 3000);
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).select();
  };

  return (
    <Card className="border border-dashed border-primary/40 bg-primary/5 mb-6 shadow-sm p-1 sm:p-2">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Gift className="h-5 w-5 text-primary" />
          <span>Refer a Colleague, Get 10% Off</span>
        </CardTitle>
        <CardDescription className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed sm:max-w-max">
          Share your referral link with colleagues. For each signup, you'll receive 10% off your next month's subscription!
        </CardDescription>
      </CardHeader>

      <CardContent>
      <div className="mb-4 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
  <div className="relative w-full">
    <Input
      value={referralLink}
      readOnly
      onClick={handleInputClick}
      className="w-full pr-12 bg-background border border-primary/30 text-sm sm:text-base"
    />
    <Button
      variant="ghost"
      size="icon"
      onClick={copyToClipboard}
      className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
      aria-label="Copy referral link"
    >
      {copied ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <Copy className="h-5 w-5" />
      )}
    </Button>
  </div>
</div>

        <div className="text-sm text-muted-foreground space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>10% off for one month per referral</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Discounts stack up to 50% off maximum</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralSystem;
