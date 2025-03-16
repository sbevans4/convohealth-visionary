
import { SubscriptionPlan } from "@/types/medical";
import PlanCard from "./PlanCard";
import { PaymentMethod } from "@/hooks/useSubscription";

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  isLoading: boolean;
  paymentMethod: PaymentMethod;
  onSubscribe: (planId: string) => void;
}

const SubscriptionPlans = ({ plans, isLoading, paymentMethod, onSubscribe }: SubscriptionPlansProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <PlanCard 
          key={plan.id} 
          plan={plan} 
          isLoading={isLoading} 
          paymentMethod={paymentMethod}
          onSubscribe={onSubscribe} 
        />
      ))}
    </div>
  );
};

export default SubscriptionPlans;
