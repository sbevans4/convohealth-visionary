
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

const StatCard = ({ title, value, change, icon: Icon, iconColor, iconBg }: StatCardProps) => {
  return (
    <Card className="border shadow-soft">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-semibold">{value}</h3>
              <span className="text-xs text-muted-foreground">{change}</span>
            </div>
          </div>
          <div className={cn("p-2 rounded-full", iconBg)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
