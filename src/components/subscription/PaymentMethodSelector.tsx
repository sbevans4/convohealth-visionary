
import { CreditCard, PaypalLogo } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { PaymentMethod } from '@/hooks/useSubscription';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

const PaymentMethodSelector = ({ 
  selectedMethod, 
  onSelectMethod 
}: PaymentMethodSelectorProps) => {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <Button
        variant={selectedMethod === 'card' ? 'default' : 'outline'}
        onClick={() => onSelectMethod('card')}
        className="justify-start"
      >
        <CreditCard className="mr-2 h-4 w-4" />
        Credit/Debit Card
      </Button>
      <Button
        variant={selectedMethod === 'paypal' ? 'default' : 'outline'}
        onClick={() => onSelectMethod('paypal')}
        className="justify-start"
      >
        <PaypalLogo className="mr-2 h-4 w-4" />
        PayPal
      </Button>
    </div>
  );
};

export default PaymentMethodSelector;
