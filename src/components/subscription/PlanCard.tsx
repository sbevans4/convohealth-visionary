
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionPlan } from "@/types/medical";
import { PaymentMethod } from "@/hooks/useSubscription";

interface PlanCardProps {
  plan: SubscriptionPlan;
  isLoading: boolean;
  paymentMethod: PaymentMethod;
  onSubscribe: (planId: string) => void;
}

const PlanCard = ({ plan, isLoading, paymentMethod, onSubscribe }: PlanCardProps) => {
  return (
    <div className={`relative ${plan.recommended ? 'mt-[-1rem] mb-[-1rem]' : ''}`}>
      <Card className={`h-full flex flex-col ${plan.recommended ? 'border-primary shadow-lg' : ''}`}>
        {plan.recommended && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            Recommended
          </div>
        )}
        <CardHeader>
          <CardTitle>{plan.name}</CardTitle>
          <CardDescription>
            {plan.name === "Enterprise" ? "For large organizations" : 
             plan.name === "Professional" ? "For small practices" : 
             "For individual practitioners"}
          </CardDescription>
          <div className="mt-2">
            <span className="text-3xl font-bold">${plan.price}</span>
            <span className="text-muted-foreground"> per {plan.interval}</span>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <ul className="space-y-2">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={() => onSubscribe(plan.id)} 
            className="w-full"
            variant={plan.recommended ? "default" : "outline"}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              plan.name === "Enterprise" ? 
                "Contact Sales" : 
                `Subscribe with ${paymentMethod === 'card' ? 'Card' : 'PayPal'}`
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PlanCard;
