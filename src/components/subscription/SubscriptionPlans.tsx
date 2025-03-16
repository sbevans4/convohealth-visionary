
import { SubscriptionPlan } from "@/types/medical";
import PlanCard from "./PlanCard";

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  isLoading: boolean;
  onSubscribe: (planId: string) => void;
}

const SubscriptionPlans = ({ plans, isLoading, onSubscribe }: SubscriptionPlansProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <PlanCard 
          key={plan.id} 
          plan={plan} 
          isLoading={isLoading} 
          onSubscribe={onSubscribe} 
        />
      ))}
    </div>
  );
};

export default SubscriptionPlans;
