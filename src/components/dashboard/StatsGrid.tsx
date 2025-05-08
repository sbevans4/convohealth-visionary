import { motion } from "framer-motion";
import { Mic, Clock, FileText, Image } from "lucide-react";
import StatCard from "./StatCard";

export interface StatData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

interface StatsGridProps {
  stats: StatData[];
}

const StatsGrid = ({ stats }: StatsGridProps) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Map icons to stat titles
  const getIconForStat = (title: string) => {
    if (title.includes("Recording")) return { icon: Mic, iconColor: "text-blue-500", iconBg: "bg-blue-100" };
    if (title.includes("Time")) return { icon: Clock, iconColor: "text-green-500", iconBg: "bg-green-100" };
    if (title.includes("SOAP")) return { icon: FileText, iconColor: "text-amber-500", iconBg: "bg-amber-100" };
    if (title.includes("Image")) return { icon: Image, iconColor: "text-purple-500", iconBg: "bg-purple-100" };
    
    // Default fallback
    return { icon: FileText, iconColor: "text-gray-500", iconBg: "bg-gray-100" };
  };

  return (
    <motion.div 
      variants={itemVariants}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
    >
      {stats.map((stat, index) => {
        const { icon, iconColor, iconBg } = getIconForStat(stat.title);
        
        return (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={icon}
            iconColor={iconColor}
            iconBg={iconBg}
          />
        );
      })}
    </motion.div>
  );
};

export default StatsGrid;
