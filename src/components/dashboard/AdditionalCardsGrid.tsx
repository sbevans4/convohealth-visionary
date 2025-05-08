import QuickActionsCard from "./QuickActionsCard";
import SubscriptionStatusCard from "./SubscriptionStatusCard";

const AdditionalCardsGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
      <QuickActionsCard />
      <SubscriptionStatusCard />
    </div>
  );
};

export default AdditionalCardsGrid;
