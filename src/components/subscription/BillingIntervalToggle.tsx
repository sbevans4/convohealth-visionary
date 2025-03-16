
import { Button } from "@/components/ui/button";

interface BillingIntervalToggleProps {
  billingInterval: 'month' | 'year';
  onChange: (interval: 'month' | 'year') => void;
}

const BillingIntervalToggle = ({ 
  billingInterval, 
  onChange 
}: BillingIntervalToggleProps) => {
  return (
    <div className="inline-flex items-center rounded-full border p-1 bg-muted/50">
      <Button
        variant={billingInterval === 'month' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('month')}
        className="rounded-full"
      >
        Monthly
      </Button>
      <Button
        variant={billingInterval === 'year' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('year')}
        className="rounded-full"
      >
        Yearly (20% off)
      </Button>
    </div>
  );
};

export default BillingIntervalToggle;
