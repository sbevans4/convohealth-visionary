
import QuickActionsCard from "./QuickActionsCard";
import SubscriptionStatusCard from "./SubscriptionStatusCard";

const AdditionalCardsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <QuickActionsCard />
      <SubscriptionStatusCard />
    </div>
  );
};

export default AdditionalCardsGrid;
